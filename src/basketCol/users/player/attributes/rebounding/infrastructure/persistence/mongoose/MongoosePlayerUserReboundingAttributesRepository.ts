import {
  IPlayerUserReboundingAttributesPrimitives,
  IPlayerUserReboundingAttributesRepository,
  Nullable,
  PlayerUserReboundingAttributes,
  PURAId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongoosePlayerUserReboundingAttributesSchema } from './mongoose-player-user-rebounding-attributes.schema';
import { IMongoosePlayerUserReboundingAttributesDocument } from './IMongoosePlayerUserReboundingAttributesDocument';

export class MongoosePlayerUserReboundingAttributesRepository
  extends MongooseRepository<IPlayerUserReboundingAttributesPrimitives, PlayerUserReboundingAttributes>
  implements IPlayerUserReboundingAttributesRepository {
  protected collectionName(): string {
    return 'player_user_rebounding_attributes';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongoosePlayerUserReboundingAttributesSchema,
    });
  }

  public static create(): MongoosePlayerUserReboundingAttributesRepository {
    return new MongoosePlayerUserReboundingAttributesRepository();
  }

  public async searchById(playerUserReboundingAttributesId: PURAId): Promise<Nullable<PlayerUserReboundingAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserReboundingAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserReboundingAttributesDocument>({ id: playerUserReboundingAttributesId.value });

    return document === null ? null : PlayerUserReboundingAttributes.fromPrimitives(
      document.id.valueOf(),
      document.offensiveRebound.valueOf(),
      document.defensiveRebound.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(playerUserReboundingAttributes: PlayerUserReboundingAttributes): Promise<void> {
    return this.persist(playerUserReboundingAttributes);
  }
}
