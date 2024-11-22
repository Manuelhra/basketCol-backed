import { convictConfig } from '../../../../../config';

export interface IS3LogoUploaderConfigFactory {
  bucketName: string;
}

export abstract class S3LogoUploaderConfigFactory {
  public static createS3LogoUploaderConfig(): IS3LogoUploaderConfigFactory {
    return {
      bucketName: convictConfig.get('aws.s3.bucketName.logo'),
    };
  }
}
