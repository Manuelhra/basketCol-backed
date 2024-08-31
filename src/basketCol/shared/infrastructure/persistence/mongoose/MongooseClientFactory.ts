import { Mongoose } from 'mongoose';
import { IMongooseConfig } from './IMongooseConfig';

export abstract class MongooseClientFactory {
  static #client: Mongoose | null = null;

  public static async createMongooseClient(params: { mongooseConfig: IMongooseConfig }): Promise<Mongoose> {
    let client: Mongoose | null = MongooseClientFactory.getMongooseClient();

    if (client === null) {
      client = await MongooseClientFactory.createAndConnectMongooseClient(params.mongooseConfig);

      MongooseClientFactory.registerMongooseClient(client);
    }

    return client;
  }

  private static getMongooseClient(): Mongoose | null {
    return MongooseClientFactory.#client;
  }

  private static async createAndConnectMongooseClient(config: IMongooseConfig): Promise<Mongoose> {
    const mongooseClient: Mongoose = new Mongoose();

    await mongooseClient.connect(`${config.uri}/${config.database}`);

    console.log(`Successfully established connection to the ${config.database} database.`);

    return mongooseClient;
  }

  private static registerMongooseClient(mongooseClient: Mongoose): void {
    MongooseClientFactory.#client = mongooseClient;
  }
}
