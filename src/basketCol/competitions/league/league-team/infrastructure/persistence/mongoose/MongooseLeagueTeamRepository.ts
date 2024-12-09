import {
  ILeagueTeamPrimitives,
  LeagueTeam,
  ILeagueTeamRepository,
  LeagueTeamId,
  Nullable,
  IPaginatedResponse,
  LeagueTeamLeagueId,
  LeagueTeamTeamId,
  LeagueTeamStatus,
} from '@basketcol/domain';

import { IMongooseLeagueTeamDocument } from './IMongooseLeagueTeamDocument';
import { MongooseRepository } from '../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseLeagueTeamSchema } from './mongoose-league-team.schema';

export class MongooseLeagueTeamRepository
  extends MongooseRepository<ILeagueTeamPrimitives, LeagueTeam>
  implements ILeagueTeamRepository {
  protected collectionName(): string {
    return 'league_team_competition';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseLeagueTeamSchema,
    });
  }

  public static create(): MongooseLeagueTeamRepository {
    return new MongooseLeagueTeamRepository();
  }

  public async findByLeagueIdAndTeamId(leagueId: LeagueTeamLeagueId, teamId: LeagueTeamTeamId): Promise<Nullable<LeagueTeam>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueTeamDocument> = await MyModel.findOne<IMongooseLeagueTeamDocument>({ leagueId: leagueId.value, teamId: teamId.value });
    return document === null ? null : this.#mapDocumentToLeagueTeam(document);
  }

  public async searchAll(params: { query?: string; page: number; perPage: number; }): Promise<IPaginatedResponse<LeagueTeam>> {
    const { query, page, perPage } = params;
    const MyModel = await this.model();
    const skip = (page - 1) * perPage;

    const filter: { $or?: { [key: string]: { $regex: RegExp } }[] } = {};

    if (query) {
      filter.$or = [
        { teamId: { $regex: new RegExp(query, 'i') } },
        { status: { $regex: new RegExp(query, 'i') } },
        { level: { $regex: new RegExp(query, 'i') } },
        { divisionLevel: { $regex: new RegExp(query, 'i') } },
      ];
    }

    const [documents, total] = await Promise.all([
      MyModel.find<IMongooseLeagueTeamDocument>(filter)
        .skip(skip)
        .limit(perPage)
        .exec(),
      MyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / perPage);
    const leagueTeams = documents.map(this.#mapDocumentToLeagueTeam);

    return {
      data: leagueTeams,
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

  public async findById(leagueTeamId: LeagueTeamId): Promise<Nullable<LeagueTeam>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueTeamDocument> = await MyModel.findOne<IMongooseLeagueTeamDocument>({ id: leagueTeamId.value });
    return document === null ? null : this.#mapDocumentToLeagueTeam(document);
  }

  public async findAllByLeagueId(leagueId: LeagueTeamLeagueId, status: LeagueTeamStatus): Promise<LeagueTeam[]> {
    const MyModel = await this.model();
    const documents: IMongooseLeagueTeamDocument[] = await MyModel.find<IMongooseLeagueTeamDocument>({ leagueId: leagueId.value, status: status.value });
    return documents.map(this.#mapDocumentToLeagueTeam);
  }

  public save(leagueTeam: LeagueTeam): Promise<void> {
    return this.persist(leagueTeam);
  }

  #mapDocumentToLeagueTeam(document: ILeagueTeamPrimitives): LeagueTeam {
    return LeagueTeam.fromPrimitives(
      document.id.valueOf(),
      document.teamId.valueOf(),
      document.leagueId.valueOf(),
      document.status.valueOf(),
      document.joinedAt.valueOf(),
      document.leftAt === null ? null : document.leftAt.valueOf(),
      document.divisionLevel === null ? null : document.divisionLevel.valueOf(),
      document.lastPromotionDate === null ? null : document.lastPromotionDate.valueOf(),
      document.lastRelegationDate === null ? null : document.lastRelegationDate.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
