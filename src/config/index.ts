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
});

convictConfig.loadFile(`${__dirname}/${convictConfig.get('env')}.json`);
convictConfig.validate({ allowed: 'strict' });
