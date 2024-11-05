import { ImageFile, UploadedImageResult, UploadImageOptions } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';

export interface IProfileImageUploader {
  uploadProfileImage(
    imageFile: ImageFile,
    options?: UploadImageOptions
  ): Promise<UploadedImageResult>;
  deleteProfileImage(imageKey: string): Promise<void>;
}
