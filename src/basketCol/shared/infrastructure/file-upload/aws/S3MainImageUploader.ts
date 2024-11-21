import { ImageFile, UploadImageOptions, UploadedImageResult } from '../../../application/file-upload/images/ports/IImageUploader';
import { IMainImageUploader } from '../../../application/file-upload/images/ports/IMainImageUploader';
import { S3ImageUploader } from './S3ImageUploader';
import { S3MainImageUploaderConfigFactory } from './S3MainImageUploaderConfigFactory';

type Dependencies = {
  folderPath: string;
};

export class S3MainImageUploader
  extends S3ImageUploader
  implements IMainImageUploader {
  private constructor(dependencies: Dependencies) {
    const { bucketName } = S3MainImageUploaderConfigFactory.createS3MainImageUploaderConfig();

    super({
      ...dependencies,
      bucketName,
    });
  }

  public static create(dependencies: Dependencies): S3MainImageUploader {
    return new S3MainImageUploader(dependencies);
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
