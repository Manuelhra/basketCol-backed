import {
  IPlayerUserCareerStatsPrimitives,
  IPlayerUserCareerStatsRepository,
  Nullable,
  PlayerUserCareerStats,
  PUCStatsId,
  PUCStatsPlayerUserId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { mongoosePlayerUserCareerStatsSchema } from './mongoose-player-user-career-stats.schema';
import { MongooseClientFactory } from '../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { IMongoosePlayerUserCareerStatsDocument } from './IMongoosePlayerUserCareerStatsDocument';

export class MongoosePlayerUserCareerStatsRepository
  extends MongooseRepository<IPlayerUserCareerStatsPrimitives, PlayerUserCareerStats>
  implements IPlayerUserCareerStatsRepository {
  protected collectionName(): string {
    return 'player_user_career_stat';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongoosePlayerUserCareerStatsSchema,
    });
  }

  public static create(): MongoosePlayerUserCareerStatsRepository {
    return new MongoosePlayerUserCareerStatsRepository();
  }

  public async findByPlayerUserId(playerUserId: PUCStatsPlayerUserId): Promise<Nullable<PlayerUserCareerStats>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePlayerUserCareerStatsDocument> = await MyModel.findOne<IMongoosePlayerUserCareerStatsDocument>({ playerUserId: playerUserId.value });
    return document === null ? null : this.#mapDocumentToPlayerUserCareerStats(document);
  }

  public async findById(pUCStatsId: PUCStatsId): Promise<Nullable<PlayerUserCareerStats>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePlayerUserCareerStatsDocument> = await MyModel.findOne<IMongoosePlayerUserCareerStatsDocument>({ id: pUCStatsId.value });
    return document === null ? null : this.#mapDocumentToPlayerUserCareerStats(document);
  }

  public update(playerUserCareerStats: PlayerUserCareerStats): Promise<void> {
    return this.persist(playerUserCareerStats);
  }

  public save(playerUserCareerStats: PlayerUserCareerStats): Promise<void> {
    return this.persist(playerUserCareerStats);
  }

  #mapDocumentToPlayerUserCareerStats(document: IMongoosePlayerUserCareerStatsDocument): PlayerUserCareerStats {
    return PlayerUserCareerStats.fromPrimitives(
      document.id.valueOf(),
      document.totalGamesPlayed.valueOf(),
      document.totalGamesWon.valueOf(),
      document.totalSeasonsLeaguePlayed.valueOf(),
      document.totalSeasonsLeagueWon.valueOf(),
      document.totalPoints.valueOf(),
      document.totalOffensiveRebounds.valueOf(),
      document.totalDefensiveRebounds.valueOf(),
      document.totalAssists.valueOf(),
      document.totalSteals.valueOf(),
      document.totalBlocks.valueOf(),
      document.totalFouls.valueOf(),
      document.totalTurnovers.valueOf(),
      document.totalThreePointersAttempted.valueOf(),
      document.totalThreePointersMade.valueOf(),
      document.totalFreeThrowsAttempted.valueOf(),
      document.totalFreeThrowsMade.valueOf(),
      document.totalFieldGoalsAttempted.valueOf(),
      document.totalFieldGoalsMade.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
