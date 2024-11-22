import { ImageFile, UploadImageOptions, UploadedImageResult } from '../../../application/file-upload/images/ports/IImageUploader';
import { ILogoUploader } from '../../../application/file-upload/images/ports/ILogoUploader';
import { S3ImageUploader } from './S3ImageUploader';
import { S3LogoUploaderConfigFactory } from './S3LogoUploaderConfigFactory';

type Dependencies = {
  folderPath: string;
};

export class S3LogoUploader
  extends S3ImageUploader
  implements ILogoUploader {
  private constructor(dependencies: Dependencies) {
    const { bucketName } = S3LogoUploaderConfigFactory.createS3LogoUploaderConfig();

    super({
      ...dependencies,
      bucketName,
    });
  }

  public static create(dependencies: Dependencies): S3LogoUploader {
    return new S3LogoUploader(dependencies);
  }

  public uploadLogo(
    imageFile: ImageFile,
    options?: Partial<UploadImageOptions>,
  ): Promise<UploadedImageResult> {
    return this.uploadImage(imageFile, options);
  }

  public deleteLogo(imageKey: string): Promise<void> {
    return this.deleteImage(imageKey);
  }
}
