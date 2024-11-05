import { ImageFile, UploadedImageResult, UploadImageOptions } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';

export interface IFacilityMainImageUploader {
  uploadMainImage(
    imageFile: ImageFile,
    options?: UploadImageOptions
  ): Promise<UploadedImageResult>;

  deleteMainImage(imageKey: string): Promise<void>;
}
