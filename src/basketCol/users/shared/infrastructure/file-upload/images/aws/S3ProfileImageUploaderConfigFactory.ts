import { convictConfig } from '../../../../../../../config';

export interface IS3ProfileImageUploaderConfig {
  bucketName: string;
}

export abstract class S3ProfileImageUploaderConfigFactory {
  public static createS3ProfileImageUploaderConfig(): IS3ProfileImageUploaderConfig {
    return {
      bucketName: convictConfig.get('aws.s3.bucketName.userProfileImage'),
    };
  }
}
