import {
  ITeamLeagueSeasonFixtureGameBoxScorePrimitives,
  ITeamLeagueSeasonFixtureGameBoxScoreRepository,
  TeamLeagueSeasonFixtureGameBoxScore,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseTeamLeagueSeasonFixtureGameBoxScoreSchema } from './mongoose-team-league-season-fixture-game-box-score.schema';

export class MongooseTeamLeagueSeasonFixtureGameBoxScoreRepository
  extends MongooseRepository<ITeamLeagueSeasonFixtureGameBoxScorePrimitives, TeamLeagueSeasonFixtureGameBoxScore>
  implements ITeamLeagueSeasonFixtureGameBoxScoreRepository {
  protected collectionName(): string {
    return 'team_league_season_fixture_game_box_score_competitions';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseTeamLeagueSeasonFixtureGameBoxScoreSchema,
    });
  }

  public static create(): MongooseTeamLeagueSeasonFixtureGameBoxScoreRepository {
    return new MongooseTeamLeagueSeasonFixtureGameBoxScoreRepository();
  }

  public save(teamLeagueSeasonFixtureGameBoxScore: TeamLeagueSeasonFixtureGameBoxScore): Promise<void> {
    return this.persist(teamLeagueSeasonFixtureGameBoxScore);
  }
}
