import { convictConfig } from '../../../../../config';

export interface IS3MainImageUploaderConfigFactory {
  bucketName: string;
}

export abstract class S3MainImageUploaderConfigFactory {
  public static createS3MainImageUploaderConfig(): IS3MainImageUploaderConfigFactory {
    return {
      bucketName: convictConfig.get('aws.s3.bucketName.mainImage'),
    };
  }
}
