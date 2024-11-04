import {
  IPlayerUserSkillAttributesPrimitives,
  IPlayerUserSkillAttributesRepository,
  Nullable,
  PlayerUserSkillAttributes,
  PUSASkillAttributesId,
  PUSASkillAttributesReferencedPlayerUserId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongoosePlayerUserSkillAttributesSchema } from './mongoose-player-user-skill-attributes.schema';
import { IMongoosePlayerUserSkillAttributesDocument } from './IMongoosePlayerUserSkillAttributesDocument';

export class MongoosePlayerUserSkillAttributesRepository
  extends MongooseRepository<IPlayerUserSkillAttributesPrimitives, PlayerUserSkillAttributes>
  implements IPlayerUserSkillAttributesRepository {
  protected collectionName(): string {
    return 'player_user_skill_attributes';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongoosePlayerUserSkillAttributesSchema,
    });
  }

  public static create(): MongoosePlayerUserSkillAttributesRepository {
    return new MongoosePlayerUserSkillAttributesRepository();
  }

  public async searchById(playerUserSkillAttributesId: PUSASkillAttributesId): Promise<Nullable<PlayerUserSkillAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserSkillAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserSkillAttributesDocument>({ id: playerUserSkillAttributesId.value });

    return document === null ? null : PlayerUserSkillAttributes.fromPrimitives(
      document.id.valueOf(),
      document.passAccuracy.valueOf(),
      document.ballHandle.valueOf(),
      document.speedWithBall.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByPlayerUserId(pUSAReferencedPlayerUserId: PUSASkillAttributesReferencedPlayerUserId): Promise<Nullable<PlayerUserSkillAttributes>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserSkillAttributesDocument> = await MyModel.findOne<IMongoosePlayerUserSkillAttributesDocument>({ playerUserId: pUSAReferencedPlayerUserId.playerUserIdAsString });

    return document === null ? null : PlayerUserSkillAttributes.fromPrimitives(
      document.id.valueOf(),
      document.passAccuracy.valueOf(),
      document.ballHandle.valueOf(),
      document.speedWithBall.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(playerUserSkillAttributes: PlayerUserSkillAttributes): Promise<void> {
    return this.persist(playerUserSkillAttributes);
  }
}
