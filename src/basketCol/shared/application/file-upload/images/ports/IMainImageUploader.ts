import { ImageFile, UploadImageOptions, UploadedImageResult } from './IImageUploader';

export interface IMainImageUploader {
  uploadMainImage(
    imageFile: ImageFile,
    options?: UploadImageOptions
  ): Promise<UploadedImageResult>;

  deleteMainImage(imageKey: string): Promise<void>;
}
