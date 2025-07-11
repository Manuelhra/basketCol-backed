import {
  IPlayerUserPhysicalAttributesPrimitives,
  IPlayerUserPhysicalAttributesRepository,
  Nullable,
  PlayerUserPhysicalAttributes,
  PUPAId,
  PUPAPlayerUserId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongoosePlayerUserPhysicalAttributesSchema } from './mongoose-player-user-physical-attributes.schema';
import { IMongoosePlayerUserPhysicalAttributesDocument } from './IMongoosePlayerUserPhysicalAttributesDocument';

export class MongoosePlayerUserPhysicalAttributesRepository
  extends MongooseRepository<IPlayerUserPhysicalAttributesPrimitives, PlayerUserPhysicalAttributes>
  implements IPlayerUserPhysicalAttributesRepository {
  protected collectionName(): string {
    return 'player_user_physical_attributes';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongoosePlayerUserPhysicalAttributesSchema,
    });
  }

  public static create(): MongoosePlayerUserPhysicalAttributesRepository {
    return new MongoosePlayerUserPhysicalAttributesRepository();
  }

  public async findById(playerUserPhysicalAttributesId: PUPAId): Promise<Nullable<PlayerUserPhysicalAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserPhysicalAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserPhysicalAttributesDocument>({ id: playerUserPhysicalAttributesId.value });

    return document === null ? null : PlayerUserPhysicalAttributes.fromPrimitives(
      document.id.valueOf(),
      document.speed.valueOf(),
      document.acceleration.valueOf(),
      document.strength.valueOf(),
      document.vertical.valueOf(),
      document.stamina.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async findByPlayerUserId(pUPAPlayerUserId: PUPAPlayerUserId): Promise<Nullable<PlayerUserPhysicalAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserPhysicalAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserPhysicalAttributesDocument>({ playerUserId: pUPAPlayerUserId.value });

    return document === null ? null : PlayerUserPhysicalAttributes.fromPrimitives(
      document.id.valueOf(),
      document.speed.valueOf(),
      document.acceleration.valueOf(),
      document.strength.valueOf(),
      document.vertical.valueOf(),
      document.stamina.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(playerUserPhysicalAttributes: PlayerUserPhysicalAttributes): Promise<void> {
    return this.persist(playerUserPhysicalAttributes);
  }
}
