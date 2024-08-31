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
});

convictConfig.loadFile(`${__dirname}/${convictConfig.get('env')}.json`);
convictConfig.validate({ allowed: 'strict' });
