import {
  Court,
  CourtId,
  ICourtPrimitives,
  ICourtRepository,
  Nullable,
  ReferencedCourtIdList,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseCourtDocument } from './IMongooseCourtDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseCourtSchema } from './mongoose-court.schema';

export class MongooseCourtRepository
  extends MongooseRepository<ICourtPrimitives, Court>
  implements ICourtRepository {
  protected collectionName(): string {
    return 'court_facility';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseCourtSchema,
    });
  }

  public static create(): MongooseCourtRepository {
    return new MongooseCourtRepository();
  }

  public async searchById(courtId: CourtId): Promise<Nullable<Court>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseCourtDocument> = await MyModel.findOne<IMongooseCourtDocument>({ id: courtId.value });

    return document === null ? null : Court.fromPrimitives(
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

  public async searchByIdList(courtIdList: ReferencedCourtIdList): Promise<Court[]> {
    const MyModel = await this.model();

    const documents:IMongooseCourtDocument[] = await MyModel.find<IMongooseCourtDocument>({ id: { $in: courtIdList.value.map((courtId) => courtId.value) } });

    return documents.map((document) => Court.fromPrimitives(
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
    ));
  }

  public save(court: Court): Promise<void> {
    return this.persist(court);
  }
}
