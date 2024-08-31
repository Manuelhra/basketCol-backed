import { convictConfig } from '../../../../../config';
import { IMongooseConfig } from './IMongooseConfig';

export abstract class MongooseConfigFactory {
  public static createMongooseConfig(): IMongooseConfig {
    return {
      uri: convictConfig.get('mongoose.uri'),
      database: convictConfig.get('mongoose.database'),
    };
  }
}
