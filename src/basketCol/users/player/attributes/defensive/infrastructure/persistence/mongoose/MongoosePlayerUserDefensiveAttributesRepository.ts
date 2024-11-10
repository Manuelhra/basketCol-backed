import {
  IPlayerUserDefensiveAttributesPrimitives,
  IPlayerUserDefensiveAttributesRepository,
  Nullable,
  PlayerUserDefensiveAttributes,
  PUDAId,
  PUDAReferencedPlayerUserId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongoosePlayerUserDefensiveAttributesSchema } from './mongoose-player-user-defensive-attributes.schema';
import { IMongoosePlayerUserDefensiveAttributesDocument } from './IMongoosePlayerUserDefensiveAttributesDocument';

export class MongoosePlayerUserDefensiveAttributesRepository
  extends MongooseRepository<IPlayerUserDefensiveAttributesPrimitives, PlayerUserDefensiveAttributes>
  implements IPlayerUserDefensiveAttributesRepository {
  protected collectionName(): string {
    return 'player_user_defensive_attributes';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongoosePlayerUserDefensiveAttributesSchema,
    });
  }

  public static create(): MongoosePlayerUserDefensiveAttributesRepository {
    return new MongoosePlayerUserDefensiveAttributesRepository();
  }

  public async findById(playerUserDefensiveAttributesId: PUDAId): Promise<Nullable<PlayerUserDefensiveAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserDefensiveAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserDefensiveAttributesDocument>({ id: playerUserDefensiveAttributesId.value });

    return document === null ? null : PlayerUserDefensiveAttributes.fromPrimitives(
      document.id.valueOf(),
      document.interiorDefense.valueOf(),
      document.perimeterDefense.valueOf(),
      document.steal.valueOf(),
      document.block.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async findByPlayerUserId(pUDAReferencedPlayerUserId: PUDAReferencedPlayerUserId): Promise<Nullable<PlayerUserDefensiveAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserDefensiveAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserDefensiveAttributesDocument>({ playerUserId: pUDAReferencedPlayerUserId.playerUserIdAsString });

    return document === null ? null : PlayerUserDefensiveAttributes.fromPrimitives(
      document.id.valueOf(),
      document.interiorDefense.valueOf(),
      document.perimeterDefense.valueOf(),
      document.steal.valueOf(),
      document.block.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(playerUserDefensiveAttributes: PlayerUserDefensiveAttributes): Promise<void> {
    return this.persist(playerUserDefensiveAttributes);
  }
}
