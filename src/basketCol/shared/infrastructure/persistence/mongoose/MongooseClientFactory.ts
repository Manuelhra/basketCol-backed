import { Mongoose } from 'mongoose';

import { IMongooseConfig } from './IMongooseConfig';
import { MongooseConfigFactory } from './MongooseConfigFactory';
import { DatabaseConnectionFailedError } from '../../exceptions/DatabaseConnectionFailedError';

export abstract class MongooseClientFactory {
  static #client: Mongoose | null = null;

  static #connectionPromise: Promise<Mongoose> | null = null;

  public static async createMongooseClient(): Promise<Mongoose> {
    if (MongooseClientFactory.#client) {
      return MongooseClientFactory.#client;
    }

    if (MongooseClientFactory.#connectionPromise) {
      return MongooseClientFactory.#connectionPromise;
    }

    const mongooseConfig: IMongooseConfig = MongooseConfigFactory.createMongooseConfig();
    MongooseClientFactory.#connectionPromise = MongooseClientFactory.#createAndConnectMongooseClient(mongooseConfig);

    try {
      MongooseClientFactory.#client = await MongooseClientFactory.#connectionPromise;
      return MongooseClientFactory.#client;
    } catch (error) {
      MongooseClientFactory.#connectionPromise = null;
      throw error;
    }
  }

  static async #createAndConnectMongooseClient(config: IMongooseConfig): Promise<Mongoose> {
    const mongooseClient: Mongoose = new Mongoose();

    try {
      await mongooseClient.connect(`${config.uri}/${config.database}`);
      console.log(`Successfully established connection to the ${config.database} database.`);
      return mongooseClient;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw DatabaseConnectionFailedError.create(errorMessage);
    }
  }
}
