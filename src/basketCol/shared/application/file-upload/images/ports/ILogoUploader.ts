import { ImageFile, UploadImageOptions, UploadedImageResult } from './IImageUploader';

export interface ILogoUploader {
  uploadLogo(
    imageFile: ImageFile,
    options?: UploadImageOptions
  ): Promise<UploadedImageResult>;

  deleteLogo(imageKey: string): Promise<void>;
}
