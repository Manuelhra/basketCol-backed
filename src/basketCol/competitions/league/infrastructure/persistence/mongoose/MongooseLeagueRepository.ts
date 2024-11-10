import {
  ILeaguePrimitives,
  ILeagueRepository,
  IPaginatedResponse,
  League,
  LeagueId,
  LeagueName,
  Nullable,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseLeagueDocument } from './IMongooseLeagueDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseLeagueSchema } from './mongoose-league.schema';

export class MongooseLeagueRepository
  extends MongooseRepository<ILeaguePrimitives, League>
  implements ILeagueRepository {
  protected collectionName(): string {
    return 'league_competition';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseLeagueSchema,
    });
  }

  public static create(): MongooseLeagueRepository {
    return new MongooseLeagueRepository();
  }

  public async findById(leagueId: LeagueId): Promise<Nullable<League>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueDocument> = await MyModel.findOne<IMongooseLeagueDocument>({ id: leagueId.value });
    return document === null ? null : this.#mapDocumentToLeague(document);
  }

  public async findByOfficialName(leagueName: LeagueName): Promise<Nullable<League>> {
    const MyModel = await this.model();
    const officialName: string = leagueName.value.official;
    const document: Nullable<IMongooseLeagueDocument> = await MyModel.findOne<IMongooseLeagueDocument>({ 'name.official': officialName });
    return document === null ? null : this.#mapDocumentToLeague(document);
  }

  public async findByShortName(leagueName: LeagueName): Promise<Nullable<League>> {
    const MyModel = await this.model();
    const shortName: string = leagueName.value.short;
    const document: Nullable<IMongooseLeagueDocument> = await MyModel.findOne<IMongooseLeagueDocument>({ 'name.short': shortName });
    return document === null ? null : this.#mapDocumentToLeague(document);
  }

  public async searchAll(params: { query?: string; page: number; perPage: number; }): Promise<IPaginatedResponse<League>> {
    const { query, page, perPage } = params;
    const MyModel = await this.model();
    const skip = (page - 1) * perPage;

    const filter: { $or?: { [key: string]: { $regex: RegExp } }[] } = {};

    if (query) {
      filter.$or = [
        { 'name.short': { $regex: new RegExp(query, 'i') } },
        { 'name.official': { $regex: new RegExp(query, 'i') } },
        { level: { $regex: new RegExp(query, 'i') } },
        { 'location.country.label': { $regex: new RegExp(query, 'i') } },
        { 'location.city.label': { $regex: new RegExp(query, 'i') } },
        { 'location.department.label': { $regex: new RegExp(query, 'i') } },
      ];
    }

    const [documents, total] = await Promise.all([
      MyModel.find<IMongooseLeagueDocument>(filter)
        .skip(skip)
        .limit(perPage)
        .exec(),
      MyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / perPage);
    const leagues = documents.map(this.#mapDocumentToLeague);

    return {
      data: leagues,
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

  public save(league: League): Promise<void> {
    return this.persist(league);
  }

  #mapDocumentToLeague(document: IMongooseLeagueDocument): League {
    return League.fromPrimitives(
      document.id.valueOf(),
      {
        short: document.name.short.valueOf(),
        official: document.name.official.valueOf(),
      },
      {
        short: document.description.short.valueOf(),
        complete: document.description.complete.valueOf(),
      },
      document.rules.valueOf(),
      document.level.valueOf(),
      {
        country: {
          code: document.location.country.code.valueOf(),
          label: document.location.country.label.valueOf(),
        },
        city: {
          code: document.location.city.code.valueOf(),
          label: document.location.city.label.valueOf(),
        },
        department: {
          code: document.location.department.code.valueOf(),
          label: document.location.department.label.valueOf(),
        },
        coords: {
          lat: document.location.coords.lat.valueOf(),
          lng: document.location.coords.lng.valueOf(),
        },
      },
      document.leagueFounderUserId.valueOf(),
      document.establishmentDate.valueOf(),
      document.isActive.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
