import {
  ITeamLeagueSeasonFixtureGameBoxScorePrimitives,
  ITeamLeagueSeasonFixtureGameBoxScoreRepository,
  Nullable,
  TeamLeagueSeasonFixtureGameBoxScore,
  TLSFGBoxScoreFixtureGameId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseTeamLeagueSeasonFixtureGameBoxScoreSchema } from './mongoose-team-league-season-fixture-game-box-score.schema';
import { IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument } from './IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument';

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

  public async find(): Promise<Nullable<TeamLeagueSeasonFixtureGameBoxScore>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument> = await MyModel.findOne<IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument>();
    return document === null ? null : this.#mapDocumentToTeamLeagueSeasonFixtureGameBoxScore(document);
  }

  public async findById(tLSFGBoxScoreFixtureGameId: TLSFGBoxScoreFixtureGameId): Promise<Nullable<TeamLeagueSeasonFixtureGameBoxScore>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument> = await MyModel.findOne<IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument>({ id: tLSFGBoxScoreFixtureGameId.value });
    return document === null ? null : this.#mapDocumentToTeamLeagueSeasonFixtureGameBoxScore(document);
  }

  public save(teamLeagueSeasonFixtureGameBoxScore: TeamLeagueSeasonFixtureGameBoxScore): Promise<void> {
    return this.persist(teamLeagueSeasonFixtureGameBoxScore);
  }

  #mapDocumentToTeamLeagueSeasonFixtureGameBoxScore(document: IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument): TeamLeagueSeasonFixtureGameBoxScore {
    return TeamLeagueSeasonFixtureGameBoxScore.fromPrimitives(
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
      document.teamId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
