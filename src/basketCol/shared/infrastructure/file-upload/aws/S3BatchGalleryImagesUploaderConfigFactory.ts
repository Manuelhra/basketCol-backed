import { convictConfig } from '../../../../../config';

export interface IS3BatchGalleryImagesUploaderConfigFactory {
  bucketName: string;
}

export abstract class S3BatchGalleryImagesUploaderConfigFactory {
  public static createS3BatchGalleryImagesUploaderConfig(): IS3BatchGalleryImagesUploaderConfigFactory {
    return {
      bucketName: convictConfig.get('aws.s3.bucketName.galleryImages'),
    };
  }
}
