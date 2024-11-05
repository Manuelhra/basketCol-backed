import { convictConfig } from '../../../../../../../config';

export interface IS3FacilityBatchImageUploaderConfigFactory {
  bucketName: string;
}

export abstract class S3FacilityBatchImageUploaderConfigFactory {
  public static createS3FacilityBatchImageUploaderConfig(): IS3FacilityBatchImageUploaderConfigFactory {
    return {
      bucketName: convictConfig.get('aws.s3.bucketName.facilityGalleryImages'),
    };
  }
}
