import { ImageFile, UploadedImageResult, UploadImageOptions } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';
import { S3ImageUploader } from '../../../../../../shared/infrastructure/file-upload/aws/S3ImageUploader';
import { IProfileImageUploader } from '../../../../application/file-upload/images/ports/IProfileImageUploader';
import { S3ProfileImageUploaderConfigFactory } from './S3ProfileImageUploaderConfigFactory';

type Dependencies = {
  folderPath: string;
};

export class S3ProfileImageUploader
  extends S3ImageUploader
  implements IProfileImageUploader {
  private constructor(dependencies: Dependencies) {
    const { bucketName } = S3ProfileImageUploaderConfigFactory.createS3ProfileImageUploaderConfig();

    super({
      ...dependencies,
      bucketName,
    });
  }

  public static create(dependencies: Dependencies): S3ProfileImageUploader {
    return new S3ProfileImageUploader(dependencies);
  }

  public uploadProfileImage(
    imageFile: ImageFile,
    options?: Partial<UploadImageOptions>,
  ): Promise<UploadedImageResult> {
    return this.uploadImage(imageFile, options);
  }

  public deleteProfileImage(imageKey: string): Promise<void> {
    return this.deleteImage(imageKey);
  }
}
