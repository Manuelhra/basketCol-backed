import { DateValueObject } from '@basketcol/domain';
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';

import {
  IImageUploader,
  ImageFile,
  UploadedImageResult,
  UploadImageOptions,
} from '../../../application/file-upload/images/ports/IImageUploader';
import { ImageUploadError } from '../../../../users/shared/infrastructure/exceptions/ImageUploadError';
import { S3ClientFactory } from './S3ClientFactory';

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

export class S3ImageUploader implements IImageUploader {
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

  protected constructor(dependencies: Dependencies) {
    this.#folderPath = dependencies.folderPath;
    this.#bucketName = dependencies.bucketName;
    this.#s3Client = S3ClientFactory.createS3Client();
  }

  public static create(dependencies: Dependencies): S3ImageUploader {
    return new S3ImageUploader(dependencies);
  }

  public async uploadImage(
    imageFile: ImageFile,
    options?: Partial<UploadImageOptions>,
  ): Promise<UploadedImageResult> {
    try {
      const finalOptions = this.#mergeOptions(options);

      // Validar antes de procesar
      await this.#validateImage(imageFile, finalOptions);

      // Procesar la imagen
      const processedImage = await this.#processImage(imageFile, finalOptions);

      // Generar key único
      const key = await this.#generateUniqueKey(imageFile.originalName);

      // Subir a S3
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
    } catch (error) {
      throw this.#handleUploadError(error);
    }
  }

  public async deleteImage(imageKey: string): Promise<void> {
    try {
      if (!await this.exists(imageKey)) {
        return; // Si no existe, consideramos la eliminación como exitosa
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

    // Validar que sea una imagen válida
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
          effort: 6, // Mejor compresión
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
      throw ImageUploadError.create(`Error processing the image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async #uploadToS3(buffer: Buffer, key: string): Promise<string> {
    const uploadCommand = new PutObjectCommand({
      Bucket: this.#bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000', // Cache for 1 year
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

  #handleUploadError(error: unknown): Error {
    if (error instanceof ImageUploadError) {
      return error;
    }

    if (error instanceof S3ServiceException) {
      switch (error.name) {
        case 'NoSuchBucket':
          return ImageUploadError.create(`Bucket ${this.#bucketName} does not exist`);
        case 'AccessDenied':
          return ImageUploadError.create('Access denied to S3 bucket');
        default:
          return ImageUploadError.create(`S3 error: ${error.message}`);
      }
    }

    return ImageUploadError.create('Unexpected error during image upload');
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
