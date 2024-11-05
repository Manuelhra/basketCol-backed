import { ImageFile, UploadedImageResult, UploadImageOptions } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';
import { S3ImageUploader } from '../../../../../../shared/infrastructure/file-upload/images/S3ImageUploader';
import { IFacilityMainImageUploader } from '../../../../application/file-upload/images/ports/IFacilityMainImageUploader';
import { S3FacilityMainImageUploaderConfigFactory } from './S3FacilityMainImageUploaderConfigFactory';

type Dependencies = {
  folderPath: string;
};

export class S3FacilityMainImageUploader
  extends S3ImageUploader
  implements IFacilityMainImageUploader {
  private constructor(dependencies: Dependencies) {
    const { bucketName } = S3FacilityMainImageUploaderConfigFactory.createS3FacilityMainImageUploaderConfig();

    super({
      ...dependencies,
      bucketName,
    });
  }

  public static create(dependencies: Dependencies): S3FacilityMainImageUploader {
    return new S3FacilityMainImageUploader(dependencies);
  }

  public uploadMainImage(
    imageFile: ImageFile,
    options?: Partial<UploadImageOptions>,
  ): Promise<UploadedImageResult> {
    return this.uploadImage(imageFile, options);
  }

  public deleteMainImage(imageKey: string): Promise<void> {
    return this.deleteImage(imageKey);
  }
}
