import {
  Gym,
  GymId,
  GymOfficialName,
  IGymPrimitives,
  IGymRepository,
  Nullable,
  ReferencedGymIdList,
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

  public async searchById(gymId: GymId): Promise<Nullable<Gym>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseGymDocument> = await MyModel.findOne<IMongooseGymDocument>({ id: gymId.value });

    return document === null ? null : Gym.fromPrimitives(
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

  public async searchByIdList(gymIdList: ReferencedGymIdList): Promise<Gym[]> {
    const MyModel = await this.model();

    const documents: IMongooseGymDocument[] = await MyModel.find<IMongooseGymDocument>({ id: { $in: gymIdList.value.map((id) => id.value) } });

    return documents.map((document) => Gym.fromPrimitives(
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
    ));
  }

  public async searchByOfficialName(gymOfficialName: GymOfficialName): Promise<Nullable<Gym>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseGymDocument> = await MyModel.findOne<IMongooseGymDocument>({ officialName: gymOfficialName.value.toUpperCase() });

    return document === null ? null : Gym.fromPrimitives(
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

  public save(gym: Gym): Promise<void> {
    return this.persist(gym);
  }
}
