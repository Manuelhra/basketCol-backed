import {
  ILeagueSeasonPrimitives,
  ILeagueSeasonRepository,
  IPaginatedResponse,
  LeagueSeason,
  LeagueSeasonId,
  Nullable,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseLeagueSeasonSchema } from './mongoose-league-season.schema';
import { IMongooseLeagueSeasonDocument } from './IMongooseLeagueSeasonDocument';

export class MongooseLeagueSeasonRepository
  extends MongooseRepository<ILeagueSeasonPrimitives, LeagueSeason>
  implements ILeagueSeasonRepository {
  protected collectionName(): string {
    return 'league_season_competition';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseLeagueSeasonSchema,
    });
  }

  public static create(): MongooseLeagueSeasonRepository {
    return new MongooseLeagueSeasonRepository();
  }

  public async searchById(leagueSeasonId: LeagueSeasonId): Promise<Nullable<LeagueSeason>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueSeasonDocument> = await MyModel.findOne<IMongooseLeagueSeasonDocument>({ id: leagueSeasonId.value });
    return document === null ? null : this.#mapDocumentToLeagueSeason(document);
  }

  public async searchAll(params: { query?: string; page: number; perPage: number; }): Promise<IPaginatedResponse<LeagueSeason>> {
    const { query, page, perPage } = params;
    const MyModel = await this.model();
    const skip = (page - 1) * perPage;

    const filter: { $or?: { [key: string]: { $regex: RegExp } }[] } = {};

    if (query) {
      filter.$or = [
        { name: { $regex: new RegExp(query, 'i') } },
        { startDate: { $regex: new RegExp(query, 'i') } },
        { endDate: { $regex: new RegExp(query, 'i') } },
        { status: { $regex: new RegExp(query, 'i') } },
        { leagueId: { $regex: new RegExp(query, 'i') } },
      ];
    }

    const [documents, total] = await Promise.all([
      MyModel.find<IMongooseLeagueSeasonDocument>(filter)
        .skip(skip)
        .limit(perPage)
        .exec(),
      MyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / perPage);
    const leagues = documents.map(this.#mapDocumentToLeagueSeason);

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

  public save(leagueSeason: LeagueSeason): Promise<void> {
    return this.persist(leagueSeason);
  }

  #mapDocumentToLeagueSeason(document: IMongooseLeagueSeasonDocument): LeagueSeason {
    return LeagueSeason.fromPrimitives(
      document.id.valueOf(),
      document.name.valueOf(),
      document.startDate.valueOf(),
      document.endDate.valueOf(),
      document.status.valueOf(),
      Array.from(document.courtIdList.values()),
      document.leagueId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
