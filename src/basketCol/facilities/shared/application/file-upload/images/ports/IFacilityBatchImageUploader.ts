import { BatchImageUploadOptions, BatchUploadProgress, BatchUploadResult } from '../../../../../../shared/application/file-upload/images/ports/IBatchImageUploader';
import { ImageFile } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';

export interface IFacilityBatchImageUploader {
  uploadGalleryImages(
    imageFiles: ImageFile[],
    options?: BatchImageUploadOptions,
    onProgress?: (progress: BatchUploadProgress) => void
  ): Promise<BatchUploadResult>;

  deleteGalleryImages(imageKeys: string[]): Promise<{
    successful: string[];
    failed: Array<{
      key: string;
      error: Error;
    }>;
  }>;
}
