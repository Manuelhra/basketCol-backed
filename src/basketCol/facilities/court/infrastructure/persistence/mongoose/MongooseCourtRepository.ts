import {
  Court,
  CourtId,
  ICourtPrimitives,
  ICourtRepository,
  IPaginatedResponse,
  Nullable,
  IdListValueObject,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseCourtDocument } from './IMongooseCourtDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseCourtSchema } from './mongoose-court.schema';

export class MongooseCourtRepository
  extends MongooseRepository<ICourtPrimitives, Court>
  implements ICourtRepository {
  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseCourtSchema,
    });
  }

  public static create(): MongooseCourtRepository {
    return new MongooseCourtRepository();
  }

  protected collectionName(): string {
    return 'court_facility';
  }

  public async findById(courtId: CourtId): Promise<Nullable<Court>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseCourtDocument> = await MyModel.findOne<IMongooseCourtDocument>({ id: courtId.value });
    return document === null ? null : this.#mapDocumentToCourt(document);
  }

  public async findAllByIdList(courtIdList: IdListValueObject): Promise<Court[]> {
    const MyModel = await this.model();
    const documents: IMongooseCourtDocument[] = await MyModel.find<IMongooseCourtDocument>({ id: { $in: courtIdList.value.map((courtId) => courtId) } });

    return documents.map(this.#mapDocumentToCourt);
  }

  public async searchAll(params: { query?: string; page: number; perPage: number; }): Promise<IPaginatedResponse<Court>> {
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
      MyModel.find<IMongooseCourtDocument>(filter)
        .skip(skip)
        .limit(perPage)
        .exec(),
      MyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / perPage);
    const courts = documents.map(this.#mapDocumentToCourt);

    return {
      data: courts,
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

  public save(court: Court): Promise<void> {
    return this.persist(court);
  }

  #mapDocumentToCourt(document: IMongooseCourtDocument): Court {
    return Court.fromPrimitives(
      document.id.valueOf(),
      document.officialName.valueOf(),
      document.establishmentDate.valueOf(),
      document.surface.valueOf(),
      document.hoopHeight.value.valueOf(),
      document.registeredById.valueOf(),
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
      document.facilityId === null ? null : document.facilityId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
