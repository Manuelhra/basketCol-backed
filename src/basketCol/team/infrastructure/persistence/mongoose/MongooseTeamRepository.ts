import {
  ITeamPrimitives,
  Team,
  ITeamRepository,
  Nullable,
  TeamId,
  IPaginatedResponse,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseTeamDocument } from './IMongooseTeamDocument';
import { MongooseClientFactory } from '../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseTeamSchema } from './mongoose-team.schema';

export class MongooseTeamRepository
  extends MongooseRepository<ITeamPrimitives, Team>
  implements ITeamRepository {
  protected collectionName(): string {
    return 'team';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseTeamSchema,
    });
  }

  public static create(): MongooseTeamRepository {
    return new MongooseTeamRepository();
  }

  public async findById(teamId: TeamId): Promise<Nullable<Team>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamDocument> = await MyModel.findOne<IMongooseTeamDocument>({ id: teamId.value });
    return document === null ? null : this.#mapDocumentToTeam(document);
  }

  public async searchAll(params: { query?: string; page: number; perPage: number; }): Promise<IPaginatedResponse<Team>> {
    const { query, page, perPage } = params;
    const MyModel = await this.model();
    const skip = (page - 1) * perPage;

    const filter: { $or?: { [key: string]: { $regex: RegExp } }[] } = {};

    if (query) {
      filter.$or = [
        { officialName: { $regex: new RegExp(query, 'i') } },
      ];
    }

    const [documents, total] = await Promise.all([
      MyModel.find<IMongooseTeamDocument>(filter)
        .skip(skip)
        .limit(perPage)
        .exec(),
      MyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / perPage);
    const teams = documents.map(this.#mapDocumentToTeam);

    return {
      data: teams,
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

  public save(team: Team): Promise<void> {
    return this.persist(team);
  }

  #mapDocumentToTeam(document: IMongooseTeamDocument): Team {
    return Team.fromPrimitives(
      document.id.valueOf(),
      document.officialName.valueOf(),
      document.gender.valueOf(),
      {
        url: document.logo.url.valueOf(),
        alt: document.logo.alt.valueOf(),
        uploadedAt: document.logo.uploadedAt.valueOf(),
        dimensions: { width: document.logo.dimensions.width.valueOf(), height: document.logo.dimensions.height.valueOf() },
      },
      {
        url: document.mainImage.url.valueOf(),
        alt: document.mainImage.alt.valueOf(),
        uploadedAt: document.mainImage.uploadedAt.valueOf(),
        dimensions: { width: document.mainImage.dimensions.width.valueOf(), height: document.mainImage.dimensions.height.valueOf() },
      },
      {
        images: document.gallery.images.map((image) => ({
          url: image.url.valueOf(),
          uploadedAt: image.uploadedAt.valueOf(),
          alt: image.alt.valueOf(),
          dimensions: {
            width: image.dimensions.width.valueOf(),
            height: image.dimensions.height.valueOf(),
          },
        })),
      },
      document.teamFounderUserId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
