import { DateValueObject } from '@basketcol/domain';
import {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
  S3ServiceException,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';

import { ImageUploadError } from '../../../../users/shared/infrastructure/exceptions/ImageUploadError';
import {
  IBatchImageUploader,
  BatchUploadProgress,
  BatchUploadResult,
  BatchImageUploadError,
  BatchImageUploadOptions,
} from '../../../application/file-upload/images/ports/IBatchImageUploader';
import { UploadImageOptions, ImageFile, UploadedImageResult } from '../../../application/file-upload/images/ports/IImageUploader';
import { S3ClientFactory } from '../aws/S3ClientFactory';

type Dependencies = {
  folderPath: string;
  bucketName: string;
};

interface ProcessedImageResult {
  buffer: Buffer;
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

export class S3BatchImageUploader implements IBatchImageUploader {
  readonly #s3Client: S3Client;

  readonly #bucketName: string;

  readonly #folderPath: string;

  readonly #defaultOptions: UploadImageOptions = {
    maxSizeInBytes: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    compressionQuality: 80,
    resizeDimensions: {
      width: 800,
      height: 800,
    },
  };

  readonly #defaultBatchOptions: BatchImageUploadOptions = {
    ...this.#defaultOptions,
    maxConcurrentUploads: 3,
    maxBatchSize: 10,
  };

  protected constructor(dependencies: Dependencies) {
    this.#folderPath = dependencies.folderPath;
    this.#bucketName = dependencies.bucketName;
    this.#s3Client = S3ClientFactory.createS3Client();
  }

  public static create(dependencies: Dependencies): S3BatchImageUploader {
    return new S3BatchImageUploader(dependencies);
  }

  public async uploadImages(
    imageFiles: ImageFile[],
    options?: BatchImageUploadOptions,
    onProgress?: (progress: BatchUploadProgress) => void,
  ): Promise<BatchUploadResult> {
    try {
      const finalOptions = this.#mergeBatchOptions(options);

      // Validar el tamaño del lote
      if (imageFiles.length > finalOptions.maxBatchSize!) {
        throw new BatchImageUploadError(
          `Batch size ${imageFiles.length} exceeds maximum allowed size of ${finalOptions.maxBatchSize}`,
        );
      }

      const result: BatchUploadResult = {
        successful: [],
        failed: [],
        totalProcessed: 0,
        totalFailed: 0,
      };

      const processQueue = async (files: ImageFile[]): Promise<void> => {
        const batch = files.slice(0, finalOptions.maxConcurrentUploads);
        if (batch.length === 0) return;

        await Promise.all(
          batch.map(async (file) => {
            try {
              const uploadedImage = await this.#processSingleImage(file, finalOptions);
              result.successful.push(uploadedImage);
            } catch (error) {
              result.failed.push({
                originalName: file.originalName,
                error: error instanceof Error ? error : new Error('Unknown error'),
              });
            }

            if (onProgress) {
              onProgress({
                total: imageFiles.length,
                completed: result.successful.length,
                failed: result.failed.length,
                inProgress: Math.min(
                  finalOptions.maxConcurrentUploads!,
                  imageFiles.length - (result.successful.length + result.failed.length),
                ),
              });
            }
          }),
        );

        // Procesar el siguiente lote
        await processQueue(files.slice(finalOptions.maxConcurrentUploads));
      };

      await processQueue(imageFiles);

      result.totalProcessed = result.successful.length + result.failed.length;
      result.totalFailed = result.failed.length;

      if (result.totalFailed === imageFiles.length) {
        throw new BatchImageUploadError('All uploads in batch failed', result);
      }

      return result;
    } catch (error) {
      throw this.#handleBatchUploadError(error);
    }
  }

  public async uploadImage(
    imageFile: ImageFile,
    options?: UploadImageOptions,
  ): Promise<UploadedImageResult> {
    return this.#processSingleImage(imageFile, this.#mergeOptions(options));
  }

  public async deleteImages(imageKeys: string[]): Promise<{
    successful: string[];
    failed: Array<{ key: string; error: Error }>;
  }> {
    const results: {
      successful: string[];
      failed: Array<{ key: string; error: Error }>;
    } = {
      successful: [],
      failed: [],
    };

    await Promise.all(
      imageKeys.map(async (key) => {
        try {
          await this.deleteImage(key);
          results.successful.push(key);
        } catch (error) {
          results.failed.push({
            key,
            error: error instanceof Error ? error : new Error('Unknown error'),
          });
        }
      }),
    );

    return results;
  }

  public async deleteImage(imageKey: string): Promise<void> {
    try {
      if (!await this.exists(imageKey)) {
        return;
      }

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.#bucketName,
        Key: imageKey,
      });

      await this.#s3Client.send(deleteCommand);
    } catch (error) {
      throw this.#handleDeleteError(error);
    }
  }

  public async existsMany(imageKeys: string[]): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    await Promise.all(
      imageKeys.map(async (key) => {
        try {
          results.set(key, await this.exists(key));
        } catch {
          results.set(key, false);
        }
      }),
    );

    return results;
  }

  public async exists(imageKey: string): Promise<boolean> {
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: this.#bucketName,
        Key: imageKey,
      });

      await this.#s3Client.send(headCommand);
      return true;
    } catch (error) {
      if (error instanceof S3ServiceException && error.name === 'NotFound') {
        return false;
      }
      throw this.#handleExistsError(error);
    }
  }

  async #processSingleImage(
    imageFile: ImageFile,
    options: UploadImageOptions,
  ): Promise<UploadedImageResult> {
    await this.#validateImage(imageFile, options);
    const processedImage = await this.#processImage(imageFile, options);
    const key = await this.#generateUniqueKey(imageFile.originalName);
    const uploadedUrl = await this.#uploadToS3(processedImage.buffer, key);

    return {
      url: uploadedUrl,
      key,
      metadata: {
        size: processedImage.metadata.size,
        mimetype: 'image/webp',
        width: processedImage.metadata.width,
        height: processedImage.metadata.height,
        createdAt: DateValueObject.getCurrentDate().dateAsString,
      },
    };
  }

  #mergeBatchOptions(options?: Partial<BatchImageUploadOptions>): BatchImageUploadOptions {
    return {
      ...this.#defaultBatchOptions,
      ...options,
    };
  }

  #mergeOptions(options?: Partial<UploadImageOptions>): UploadImageOptions {
    return {
      ...this.#defaultOptions,
      ...options,
    };
  }

  async #validateImage(imageFile: ImageFile, options: UploadImageOptions): Promise<void> {
    if (!imageFile.buffer || !imageFile.metadata) {
      throw ImageUploadError.create('Invalid image file provided');
    }

    if (options.maxSizeInBytes && imageFile.metadata.size > options.maxSizeInBytes) {
      throw ImageUploadError.create(
        `File size ${imageFile.metadata.size} exceeds maximum allowed size of ${options.maxSizeInBytes} bytes`,
      );
    }

    if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(imageFile.metadata.mimetype)) {
      throw ImageUploadError.create(
        `File type ${imageFile.metadata.mimetype} not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`,
      );
    }

    try {
      await sharp(imageFile.buffer).metadata();
    } catch {
      throw ImageUploadError.create('Invalid image format');
    }
  }

  async #processImage(
    imageFile: ImageFile,
    options: UploadImageOptions,
  ): Promise<ProcessedImageResult> {
    try {
      let sharpInstance = sharp(imageFile.buffer);

      if (options.resizeDimensions) {
        sharpInstance = sharpInstance.resize(
          options.resizeDimensions.width,
          options.resizeDimensions.height,
          {
            fit: 'inside',
            withoutEnlargement: true,
          },
        );
      }

      const { data, info } = await sharpInstance
        .webp({
          quality: options.compressionQuality,
          effort: 6,
        })
        .toBuffer({ resolveWithObject: true });

      return {
        buffer: data,
        metadata: {
          width: info.width,
          height: info.height,
          format: info.format,
          size: info.size,
        },
      };
    } catch (error) {
      throw ImageUploadError.create(
        `Error processing the image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async #uploadToS3(buffer: Buffer, key: string): Promise<string> {
    const uploadCommand = new PutObjectCommand({
      Bucket: this.#bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000',
      Metadata: {
        'upload-date': new Date().toISOString(),
      },
    });

    await this.#s3Client.send(uploadCommand);
    return `https://${this.#bucketName}.s3.amazonaws.com/${key}`;
  }

  async #generateUniqueKey(originalFilename: string): Promise<string> {
    const timestamp = Date.now();
    const hash = crypto.createHash('sha256')
      .update(`${originalFilename}-${timestamp}-${Math.random()}`)
      .digest('hex')
      .substring(0, 8);

    return `${this.#folderPath}/${timestamp}-${hash}.webp`;
  }

  #handleBatchUploadError(error: unknown): Error {
    if (error instanceof BatchImageUploadError) {
      return error;
    }

    if (error instanceof ImageUploadError) {
      return new BatchImageUploadError(error.message);
    }

    if (error instanceof S3ServiceException) {
      switch (error.name) {
        case 'NoSuchBucket':
          return new BatchImageUploadError(`Bucket ${this.#bucketName} does not exist`);
        case 'AccessDenied':
          return new BatchImageUploadError('Access denied to S3 bucket');
        default:
          return new BatchImageUploadError(`S3 error: ${error.message}`);
      }
    }

    return new BatchImageUploadError('Unexpected error during batch upload');
  }

  #handleDeleteError(error: unknown): Error {
    if (error instanceof S3ServiceException) {
      return ImageUploadError.create(`Failed to delete image: ${error.message}`);
    }
    return ImageUploadError.create('Unexpected error during image deletion');
  }

  #handleExistsError(error: unknown): Error {
    if (error instanceof S3ServiceException) {
      return ImageUploadError.create(`Failed to check image existence: ${error.message}`);
    }
    return ImageUploadError.create('Unexpected error while checking image existence');
  }
}
