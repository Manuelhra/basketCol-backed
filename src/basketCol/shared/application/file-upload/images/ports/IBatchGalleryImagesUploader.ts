import { BatchImageUploadOptions, BatchUploadProgress, BatchUploadResult } from './IBatchImageUploader';
import { ImageFile } from './IImageUploader';

export interface IBatchGalleryImagesUploader {
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
