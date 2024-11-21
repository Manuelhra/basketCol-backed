import {
  Gym,
  GymId,
  GymOfficialName,
  IGymPrimitives,
  IGymRepository,
  IPaginatedResponse,
  Nullable,
  IdListValueObject,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseGymSchema } from './mongoose-gym.schema';
import { IMongooseGymDocument } from './IMongooseGymDocument';

export class MongooseGymRepository
  extends MongooseRepository<IGymPrimitives, Gym>
  implements IGymRepository {
  protected collectionName(): string {
    return 'gym_facility';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseGymSchema,
    });
  }

  public static create(): MongooseGymRepository {
    return new MongooseGymRepository();
  }

  public async findById(gymId: GymId): Promise<Nullable<Gym>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseGymDocument> = await MyModel.findOne<IMongooseGymDocument>({ id: gymId.value });
    return document === null ? null : this.#mapDocumentToGym(document);
  }

  public async findByIdList(gymIdList: IdListValueObject): Promise<Gym[]> {
    const MyModel = await this.model();
    const documents: IMongooseGymDocument[] = await MyModel.find<IMongooseGymDocument>({ id: { $in: gymIdList.value.map((id) => id) } });
    return documents.map(this.#mapDocumentToGym);
  }

  public async findByOfficialName(gymOfficialName: GymOfficialName): Promise<Nullable<Gym>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseGymDocument> = await MyModel.findOne<IMongooseGymDocument>({ officialName: gymOfficialName.value.toUpperCase() });
    return document === null ? null : this.#mapDocumentToGym(document);
  }

  public async searchAll(params: { query?: string; page: number; perPage: number; }): Promise<IPaginatedResponse<Gym>> {
    const { query, page, perPage } = params;
    const MyModel = await this.model();
    const skip = (page - 1) * perPage;

    const filter: { $or?: { [key: string]: { $regex: RegExp } }[] } = {};

    if (query) {
      filter.$or = [
        { officialName: { $regex: new RegExp(query, 'i') } },
        { 'location.country.label': { $regex: new RegExp(query, 'i') } },
        { 'location.city.label': { $regex: new RegExp(query, 'i') } },
        { 'location.department.label': { $regex: new RegExp(query, 'i') } },
      ];
    }

    const [documents, total] = await Promise.all([
      MyModel.find<IMongooseGymDocument>(filter)
        .skip(skip)
        .limit(perPage)
        .exec(),
      MyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / perPage);
    const gyms = documents.map(this.#mapDocumentToGym);

    return {
      data: gyms,
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

  public async findAllByIdList(gymIdList: IdListValueObject): Promise<Gym[]> {
    const MyModel = await this.model();
    const documents: IMongooseGymDocument[] = await MyModel.find<IMongooseGymDocument>({ id: { $in: gymIdList.value.map((id) => id) } });
    return documents.map(this.#mapDocumentToGym);
  }

  public save(gym: Gym): Promise<void> {
    return this.persist(gym);
  }

  #mapDocumentToGym(document: IMongooseGymDocument): Gym {
    return Gym.fromPrimitives(
      document.id.valueOf(),
      document.officialName.valueOf(),
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
      document.establishmentDate.valueOf(),
      document.registeredById.valueOf(),
      {
        url: document.mainImage.url.valueOf(),
        uploadedAt: document.mainImage.uploadedAt.valueOf(),
        alt: document.mainImage.alt.valueOf(),
        dimensions: {
          width: document.mainImage.dimensions.width.valueOf(),
          height: document.mainImage.dimensions.height.valueOf(),
        },
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
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
