import { IBatchGalleryImagesUploader } from '../../../application/file-upload/images/ports/IBatchGalleryImagesUploader';
import { BatchImageUploadOptions, BatchUploadProgress, BatchUploadResult } from '../../../application/file-upload/images/ports/IBatchImageUploader';
import { ImageFile } from '../../../application/file-upload/images/ports/IImageUploader';
import { S3BatchGalleryImagesUploaderConfigFactory } from './S3BatchGalleryImagesUploaderConfigFactory';
import { S3BatchImageUploader } from './S3BatchImageUploader';

type Dependencies = {
  folderPath: string;
};

export class S3BatchGalleryImagesUploader
  extends S3BatchImageUploader
  implements IBatchGalleryImagesUploader {
  private constructor(dependencies: Dependencies) {
    const { bucketName } = S3BatchGalleryImagesUploaderConfigFactory.createS3BatchGalleryImagesUploaderConfig();

    super({
      ...dependencies,
      bucketName,
    });
  }

  public static override create(dependencies: Dependencies): S3BatchGalleryImagesUploader {
    return new S3BatchGalleryImagesUploader(dependencies);
  }

  public uploadGalleryImages(imageFiles: ImageFile[], options?: BatchImageUploadOptions, onProgress?: (progress: BatchUploadProgress) => void): Promise<BatchUploadResult> {
    return this.uploadImages(imageFiles, options, onProgress);
  }

  public deleteGalleryImages(imageKeys: string[]): Promise<{ successful: string[]; failed: Array<{ key: string; error: Error; }>; }> {
    return this.deleteImages(imageKeys);
  }
}
