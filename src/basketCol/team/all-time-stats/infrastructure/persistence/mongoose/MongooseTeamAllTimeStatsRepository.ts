import {
  ITeamAllTimeStatsPrimitives,
  ITeamAllTimeStatsRepository,
  Nullable,
  TATStatsId,
  TATStatsTeamId,
  TeamAllTimeStats,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseTeamAllTimeStatsSchema } from './mongoose-team-all-time-stats.schema';
import { IMongooseTeamAllTimeStatsDocument } from './IMongooseTeamAllTimeStatsDocument';

export class MongooseTeamAllTimeStatsRepository
  extends MongooseRepository<ITeamAllTimeStatsPrimitives, TeamAllTimeStats>
  implements ITeamAllTimeStatsRepository {
  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseTeamAllTimeStatsSchema,
    });
  }

  public static create(): MongooseTeamAllTimeStatsRepository {
    return new MongooseTeamAllTimeStatsRepository();
  }

  protected collectionName(): string {
    return 'team_all_time_stats';
  }

  public async findById(teamAllTimeStatsId: TATStatsId): Promise<Nullable<TeamAllTimeStats>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamAllTimeStatsDocument> = await MyModel.findOne<IMongooseTeamAllTimeStatsDocument>({ id: teamAllTimeStatsId.value });
    return document === null ? null : this.#mapDocumentToTeamAllTimeStats(document);
  }

  public async findByTeamId(teamId: TATStatsTeamId): Promise<Nullable<TeamAllTimeStats>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamAllTimeStatsDocument> = await MyModel.findOne<IMongooseTeamAllTimeStatsDocument>({ teamId: teamId.value });
    return document === null ? null : this.#mapDocumentToTeamAllTimeStats(document);
  }

  public save(teamAllTimeStats: TeamAllTimeStats): Promise<void> {
    return this.persist(teamAllTimeStats);
  }

  #mapDocumentToTeamAllTimeStats(document: IMongooseTeamAllTimeStatsDocument): TeamAllTimeStats {
    return TeamAllTimeStats.fromPrimitives(
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
      document.teamId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
