import {
  ILeagueSeasonFixtureGamePrimitives,
  LeagueSeasonFixtureGame,
  ILeagueSeasonFixtureGameRepository,
  LSFGameId,
  Nullable,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseLeagueSeasonFixtureGameDocument } from './IMongooseLeagueSeasonFixtureGameDocument';
import { MongooseClientFactory } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseLeagueSeasonFixtureGameSchema } from './mongoose-league-season-fixture-game.schema';

export class MongooseLeagueSeasonFixtureGameRepository
  extends MongooseRepository<ILeagueSeasonFixtureGamePrimitives, LeagueSeasonFixtureGame>
  implements ILeagueSeasonFixtureGameRepository {
  protected collectionName(): string {
    return 'league_season_fixture_game';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseLeagueSeasonFixtureGameSchema,
    });
  }

  public static create(): MongooseLeagueSeasonFixtureGameRepository {
    return new MongooseLeagueSeasonFixtureGameRepository();
  }

  public async findById(leagueSeasonFixtureGameId: LSFGameId): Promise<Nullable<LeagueSeasonFixtureGame>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueSeasonFixtureGameDocument> = await MyModel.findOne<IMongooseLeagueSeasonFixtureGameDocument>({ id: leagueSeasonFixtureGameId.value });
    return document === null ? null : this.#mapDocumentToLeagueSeasonFixtureGame(document);
  }

  public save(leagueSeasonFixtureGame: LeagueSeasonFixtureGame): Promise<void> {
    return this.persist(leagueSeasonFixtureGame);
  }

  #mapDocumentToLeagueSeasonFixtureGame(document: IMongooseLeagueSeasonFixtureGameDocument): LeagueSeasonFixtureGame {
    return LeagueSeasonFixtureGame.fromPrimitives(
      document.id.valueOf(),
      document.startTime.valueOf(),
      document.endTime !== null ? document.endTime.valueOf() : null,
      document.homeTeamId.valueOf(),
      document.awayTeamId.valueOf(),
      document.homeScore.valueOf(),
      document.awayScore.valueOf(),
      document.gameType.valueOf(),
      document.gameDuration.value.valueOf(),
      document.quarter !== null ? document.quarter.valueOf() : null,
      document.overtime.valueOf(),
      document.overtimeNumber !== null ? document.overtimeNumber.valueOf() : null,
      document.gameStatus.valueOf(),
      document.headRefereeId.valueOf(),
      document.assistantRefereeId.valueOf(),
      document.courtId.valueOf(),
      document.fixtureId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
