import { convictConfig } from '../../../../../config';
import { IS3Config } from './IS3Config';

export abstract class S3ConfigFactory {
  public static createS3Config(): IS3Config {
    return {
      region: convictConfig.get('aws.s3.region'),
      accessKeyId: convictConfig.get('aws.s3.accessKeyId'),
      secretAccessKey: convictConfig.get('aws.s3.secretAccessKey'),
    };
  }
}
