import { S3Client } from '@aws-sdk/client-s3';

import { S3ConfigFactory } from './S3ConfigFactory';

export abstract class S3ClientFactory {
  public static createS3Client(): S3Client {
    const config = S3ConfigFactory.createS3Config();

    return new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
}
