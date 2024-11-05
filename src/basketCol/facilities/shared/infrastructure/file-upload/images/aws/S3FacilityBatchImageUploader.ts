import { BatchImageUploadOptions, BatchUploadProgress, BatchUploadResult } from '../../../../../../shared/application/file-upload/images/ports/IBatchImageUploader';
import { ImageFile } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';
import { S3BatchImageUploader } from '../../../../../../shared/infrastructure/file-upload/images/S3BatchImageUploader';
import { IFacilityBatchImageUploader } from '../../../../application/file-upload/images/ports/IFacilityBatchImageUploader';
import { S3FacilityBatchImageUploaderConfigFactory } from './S3FacilityBatchImageUploaderConfigFactory';

type Dependencies = {
  folderPath: string;
};

export class S3FacilityBatchImageUploader
  extends S3BatchImageUploader
  implements IFacilityBatchImageUploader {
  private constructor(dependencies: Dependencies) {
    const { bucketName } = S3FacilityBatchImageUploaderConfigFactory.createS3FacilityBatchImageUploaderConfig();

    super({
      ...dependencies,
      bucketName,
    });
  }

  public static override create(dependencies: Dependencies): S3FacilityBatchImageUploader {
    return new S3FacilityBatchImageUploader(dependencies);
  }

  public uploadGalleryImages(imageFiles: ImageFile[], options?: BatchImageUploadOptions, onProgress?: (progress: BatchUploadProgress) => void): Promise<BatchUploadResult> {
    return this.uploadImages(imageFiles, options, onProgress);
  }

  public deleteGalleryImages(imageKeys: string[]): Promise<{ successful: string[]; failed: Array<{ key: string; error: Error; }>; }> {
    return this.deleteImages(imageKeys);
  }
}
