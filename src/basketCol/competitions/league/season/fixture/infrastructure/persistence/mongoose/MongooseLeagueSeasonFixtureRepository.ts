import {
  ILeagueSeasonFixturePrimitives,
  ILeagueSeasonFixtureRepository,
  IPaginatedResponse,
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

  public async findById(leagueSeasonFixtureId: LSFixtureId): Promise<Nullable<LeagueSeasonFixture>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueSeasonFixtureDocument> = await MyModel.findOne<IMongooseLeagueSeasonFixtureDocument>({ id: leagueSeasonFixtureId.value });
    return document === null ? null : this.#mapDocumentToLeagueSeason(document);
  }

  public async findByLeagueSeasonIdAndDate(leagueSeasonId: LSFixtureLeagueSeasonId, date: LSFixtureDate): Promise<Nullable<LeagueSeasonFixture>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueSeasonFixtureDocument> = await MyModel.findOne<IMongooseLeagueSeasonFixtureDocument>({ leagueSeasonId: leagueSeasonId.value, date: date.value });
    return document === null ? null : this.#mapDocumentToLeagueSeason(document);
  }

  public async findAllByLeagueSeasonId(leagueSeasonId: LSFixtureLeagueSeasonId): Promise<LeagueSeasonFixture[]> {
    const MyModel = await this.model();
    const documents: IMongooseLeagueSeasonFixtureDocument[] = await MyModel.find<IMongooseLeagueSeasonFixtureDocument>({ leagueSeasonId: leagueSeasonId.value });
    return documents.map((document) => this.#mapDocumentToLeagueSeason(document));
  }

  public async searchAll(params: { query?: string; page: number; perPage: number; }): Promise<IPaginatedResponse<LeagueSeasonFixture>> {
    const { query, page, perPage } = params;
    const MyModel = await this.model();
    const skip = (page - 1) * perPage;

    const filter: { $or?: { [key: string]: { $regex: RegExp } }[] } = {};

    if (query) {
      filter.$or = [
        { name: { $regex: new RegExp(query, 'i') } },
        { date: { $regex: new RegExp(query, 'i') } },
      ];
    }

    const [documents, total] = await Promise.all([
      MyModel.find<IMongooseLeagueSeasonFixtureDocument>(filter)
        .skip(skip)
        .limit(perPage)
        .exec(),
      MyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / perPage);
    const leagueSeasonFixtures = documents.map(this.#mapDocumentToLeagueSeason);

    return {
      data: leagueSeasonFixtures,
      pagination: {
        currentPage: page,
        perPage,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        firstPage: 1,
        lastPage: totalPages,
      },
    };
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
