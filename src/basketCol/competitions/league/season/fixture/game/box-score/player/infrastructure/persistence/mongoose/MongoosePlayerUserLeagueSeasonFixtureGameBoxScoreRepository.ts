import {
  IPlayerUserLeagueSeasonFixtureGameBoxScorePrimitives,
  IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository,
  PlayerUserLeagueSeasonFixtureGameBoxScore,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongoosePlayerUserLeagueSeasonFixtureGameBoxScoreSchema } from './mongoose-player-user-league-season-fixture-game-box-score.schema';

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

  public save(playerUserLeagueSeasonFixtureGameBoxScore: PlayerUserLeagueSeasonFixtureGameBoxScore): Promise<void> {
    return this.persist(playerUserLeagueSeasonFixtureGameBoxScore);
  }
}
