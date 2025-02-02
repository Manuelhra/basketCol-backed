import {
  IPlayerUserLeagueSeasonFixtureGameBoxScorePrimitives,
  IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository,
  Nullable,
  PlayerUserLeagueSeasonFixtureGameBoxScore,
  PLSFGBoxScoreFixtureGameId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongoosePlayerUserLeagueSeasonFixtureGameBoxScoreSchema } from './mongoose-player-user-league-season-fixture-game-box-score.schema';
import { IMongoosePlayerUserLeagueSeasonFixtureGameBoxScoreDocument } from './IMongoosePlayerUserLeagueSeasonFixtureGameBoxScoreDocument';

export class MongoosePlayerUserLeagueSeasonFixtureGameBoxScoreRepository
  extends MongooseRepository<IPlayerUserLeagueSeasonFixtureGameBoxScorePrimitives, PlayerUserLeagueSeasonFixtureGameBoxScore>
  implements IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository {
  protected collectionName(): string {
    return 'player-user_league_season_fixture_game_box_score_competitions';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongoosePlayerUserLeagueSeasonFixtureGameBoxScoreSchema,
    });
  }

  public static create(): MongoosePlayerUserLeagueSeasonFixtureGameBoxScoreRepository {
    return new MongoosePlayerUserLeagueSeasonFixtureGameBoxScoreRepository();
  }

  public async find(): Promise<Nullable<PlayerUserLeagueSeasonFixtureGameBoxScore>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePlayerUserLeagueSeasonFixtureGameBoxScoreDocument> = await MyModel.findOne<IMongoosePlayerUserLeagueSeasonFixtureGameBoxScoreDocument>();
    return document === null ? null : this.#mapDocumentToPlayerUserLeagueSeasonFixtureGameBoxScore(document);
  }

  public async findById(pLSFGBoxScoreFixtureGameId: PLSFGBoxScoreFixtureGameId): Promise<Nullable<PlayerUserLeagueSeasonFixtureGameBoxScore>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePlayerUserLeagueSeasonFixtureGameBoxScoreDocument> = await MyModel.findOne<IMongoosePlayerUserLeagueSeasonFixtureGameBoxScoreDocument>({ id: pLSFGBoxScoreFixtureGameId.value });
    return document === null ? null : this.#mapDocumentToPlayerUserLeagueSeasonFixtureGameBoxScore(document);
  }

  public save(playerUserLeagueSeasonFixtureGameBoxScore: PlayerUserLeagueSeasonFixtureGameBoxScore): Promise<void> {
    return this.persist(playerUserLeagueSeasonFixtureGameBoxScore);
  }

  #mapDocumentToPlayerUserLeagueSeasonFixtureGameBoxScore(document: IMongoosePlayerUserLeagueSeasonFixtureGameBoxScoreDocument): PlayerUserLeagueSeasonFixtureGameBoxScore {
    return PlayerUserLeagueSeasonFixtureGameBoxScore.fromPrimitives(
      document.id.valueOf(),
      document.points.valueOf(),
      document.offensiveRebounds.valueOf(),
      document.defensiveRebounds.valueOf(),
      document.assists.valueOf(),
      document.steals.valueOf(),
      document.blocks.valueOf(),
      document.fouls.valueOf(),
      document.turnovers.valueOf(),
      document.threePointersAttempted.valueOf(),
      document.threePointersMade.valueOf(),
      document.freeThrowsAttempted.valueOf(),
      document.freeThrowsMade.valueOf(),
      document.fieldGoalsAttempted.valueOf(),
      document.fieldGoalsMade.valueOf(),
      document.fixtureGameId.valueOf(),
      document.playerUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
