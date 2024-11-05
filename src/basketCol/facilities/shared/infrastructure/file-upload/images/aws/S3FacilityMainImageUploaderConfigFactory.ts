import { convictConfig } from '../../../../../../../config';

export interface IS3FacilityMainImageUploaderConfigFactory {
  bucketName: string;
}

export abstract class S3FacilityMainImageUploaderConfigFactory {
  public static createS3FacilityMainImageUploaderConfig(): IS3FacilityMainImageUploaderConfigFactory {
    return {
      bucketName: convictConfig.get('aws.s3.bucketName.facilityMainImage'),
    };
  }
}
