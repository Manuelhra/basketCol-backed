import {
  ILeagueSeasonFixturePrimitives,
  ILeagueSeasonFixtureRepository,
  LeagueSeasonFixture,
  LSFixtureDate,
  LSFixtureId,
  LSFixtureLeagueSeasonId,
  Nullable,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseLeagueSeasonFixtureSchema } from './mongoose-league-season-fixture.schema';
import { IMongooseLeagueSeasonFixtureDocument } from './IMongooseLeagueSeasonFixtureDocument';

export class MongooseLeagueSeasonFixtureRepository
  extends MongooseRepository<ILeagueSeasonFixturePrimitives, LeagueSeasonFixture>
  implements ILeagueSeasonFixtureRepository {
  protected collectionName(): string {
    return 'league_season_fixture_competition';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseLeagueSeasonFixtureSchema,
    });
  }

  public static create(): MongooseLeagueSeasonFixtureRepository {
    return new MongooseLeagueSeasonFixtureRepository();
  }

  public async searchById(leagueSeasonFixtureId: LSFixtureId): Promise<Nullable<LeagueSeasonFixture>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueSeasonFixtureDocument> = await MyModel.findOne<IMongooseLeagueSeasonFixtureDocument>({ id: leagueSeasonFixtureId.value });
    return document === null ? null : this.#mapDocumentToLeagueSeason(document);
  }

  public async searchByLeagueSeasonIdAndDate(leagueSeasonId: LSFixtureLeagueSeasonId, date: LSFixtureDate): Promise<Nullable<LeagueSeasonFixture>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueSeasonFixtureDocument> = await MyModel.findOne<IMongooseLeagueSeasonFixtureDocument>({ leagueSeasonId: leagueSeasonId.value, date: date.value });
    return document === null ? null : this.#mapDocumentToLeagueSeason(document);
  }

  public save(leagueSeasonFixture: LeagueSeasonFixture): Promise<void> {
    return this.persist(leagueSeasonFixture);
  }

  #mapDocumentToLeagueSeason(document: IMongooseLeagueSeasonFixtureDocument): LeagueSeasonFixture {
    return LeagueSeasonFixture.fromPrimitives(
      document.id.valueOf(),
      document.date.valueOf(),
      document.name ? document.name.valueOf() : null,
      document.leagueSeasonId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
