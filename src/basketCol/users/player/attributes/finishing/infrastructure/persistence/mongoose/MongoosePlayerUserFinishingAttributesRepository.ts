import {
  IPlayerUserFinishingAttributesPrimitives,
  IPlayerUserFinishingAttributesRepository,
  Nullable,
  PlayerUserFinishingAttributes,
  PUFAId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { mongoosePlayerUserFinishingAttributesSchema } from './mongoose-player-user-finishing-attributes.schema';
import { MongooseClientFactory } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { IMongoosePlayerUserFinishingAttributesDocument } from './IMongoosePlayerUserFinishingAttributesDocument';

export class MongoosePlayerUserFinishingAttributesRepository
  extends MongooseRepository<IPlayerUserFinishingAttributesPrimitives, PlayerUserFinishingAttributes>
  implements IPlayerUserFinishingAttributesRepository {
  protected collectionName(): string {
    return 'player_user_finishing_attributes';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongoosePlayerUserFinishingAttributesSchema,
    });
  }

  public static create(): MongoosePlayerUserFinishingAttributesRepository {
    return new MongoosePlayerUserFinishingAttributesRepository();
  }

  public async searchById(playerUserFinishingAttributesId: PUFAId): Promise<Nullable<PlayerUserFinishingAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserFinishingAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserFinishingAttributesDocument>({ id: playerUserFinishingAttributesId.value });

    return document === null ? null : PlayerUserFinishingAttributes.fromPrimitives(
      document.id.valueOf(),
      document.drivingLayup.valueOf(),
      document.drivingDunk.valueOf(),
      document.standingDunk.valueOf(),
      document.postControl.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(playerUserFinishingAttributes: PlayerUserFinishingAttributes): Promise<void> {
    return this.persist(playerUserFinishingAttributes);
  }
}
