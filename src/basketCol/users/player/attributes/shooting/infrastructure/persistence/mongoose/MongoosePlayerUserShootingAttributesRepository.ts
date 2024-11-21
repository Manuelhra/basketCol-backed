import {
  IPlayerUserShootingAttributesPrimitives,
  IPlayerUserShootingAttributesRepository,
  Nullable,
  PlayerUserShootingAttributes,
  PUShootingAttributesId,
  PUShootingAttributesPlayerUserId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { mongoosePlayerUserShootingAttributesSchema } from './mongoose-player-user-shooting-attributes.schema';
import { MongooseClientFactory } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { IMongoosePlayerUserShootingAttributesDocument } from './IMongoosePlayerUserShootingAttributesDocument';

export class MongoosePlayerUserShootingAttributesRepository
  extends MongooseRepository<IPlayerUserShootingAttributesPrimitives, PlayerUserShootingAttributes>
  implements IPlayerUserShootingAttributesRepository {
  protected collectionName(): string {
    return 'player_user_shooting_attributes';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongoosePlayerUserShootingAttributesSchema,
    });
  }

  public static create(): MongoosePlayerUserShootingAttributesRepository {
    return new MongoosePlayerUserShootingAttributesRepository();
  }

  public async findById(playerUserShootingAttributesId: PUShootingAttributesId): Promise<Nullable<PlayerUserShootingAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserShootingAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserShootingAttributesDocument>({ id: playerUserShootingAttributesId.value });

    return document === null ? null : PlayerUserShootingAttributes.fromPrimitives(
      document.id.valueOf(),
      document.closeShot.valueOf(),
      document.midRangeShot.valueOf(),
      document.threePointShot.valueOf(),
      document.freeThrow.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async findByPlayerUserId(pUSAPlayerUserId: PUShootingAttributesPlayerUserId): Promise<Nullable<PlayerUserShootingAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserShootingAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserShootingAttributesDocument>({ playerUserId: pUSAPlayerUserId.value });

    return document === null ? null : PlayerUserShootingAttributes.fromPrimitives(
      document.id.valueOf(),
      document.closeShot.valueOf(),
      document.midRangeShot.valueOf(),
      document.threePointShot.valueOf(),
      document.freeThrow.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(playerUserShootingAttributes: PlayerUserShootingAttributes): Promise<void> {
    return this.persist(playerUserShootingAttributes);
  }
}
