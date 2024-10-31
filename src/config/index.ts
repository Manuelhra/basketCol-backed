import convict from 'convict';

import { IConvictProps } from './IConvictProps';

export const convictConfig = convict<IConvictProps>({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    env: 'NODE_ENV',
    default: 'development',
  },
  server: {
    port: {
      doc: 'The server port',
      format: 'port',
      env: 'PORT',
      default: '8000',
    },
  },
  mongoose: {
    uri: {
      doc: 'The MongoDB URI',
      format: String,
      env: 'MONGO_URI',
      default: 'mongodb://localhost:27017',
    },
    database: {
      doc: 'The MongoDB database',
      format: String,
      env: 'MONGO_DATABASE',
      default: 'basketcol-dev',
    },
  },
  jwt: {
    secretKeys: {
      authenticateUserSecretKey: {
        doc: 'The secret key for the authenticate user token',
        format: String,
        env: 'JWT_AUTHENTICATE_USER_SECRET_KEY',
        default: 'authenticateUserSecretKey',
      },
      refreshTokenSecretKey: {
        doc: 'The secret key for the refresh token',
        format: String,
        env: 'JWT_REFRESH_TOKEN_SECRET_KEY',
        default: 'refreshTokenSecretKey',
      },
    },
  },
  hostUserCredentials: {
    email: {
      value: {
        doc: 'The host user email',
        format: String,
        env: 'HOST_USER_EMAIL',
        default: 'basket.dev@gmail.com',
      },
    },
    password: {
      doc: 'The host user password',
      format: String,
      env: 'HOST_USER_PASSWORD',
      default: 'BasketColDev2024',
    },
  },
  aws: {
    s3: {
      region: {
        doc: 'AWS Region',
        format: String,
        default: 'us-east-1',
        env: 'AWS_REGION',
      },
      accessKeyId: {
        doc: 'AWS Access Key ID',
        format: String,
        default: null,
        env: 'AWS_ACCESS_KEY_ID',
        sensitive: true,
      },
      secretAccessKey: {
        doc: 'AWS Secret Access Key',
        format: String,
        default: null,
        env: 'AWS_SECRET_ACCESS_KEY',
        sensitive: true,
      },
      bucketName: {
        userProfileImage: {
          doc: 'The bucket name for the user profile image',
          format: String,
          env: 'AWS_S3_BUCKET_NAME_USER_PROFILE_IMAGE',
          default: null,
        },
      },
    },
  },
});

convictConfig.loadFile(`${__dirname}/${convictConfig.get('env')}.json`);
convictConfig.validate({ allowed: 'strict' });
