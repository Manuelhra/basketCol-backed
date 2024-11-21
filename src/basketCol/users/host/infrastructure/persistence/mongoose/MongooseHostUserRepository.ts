import {
  HostUser,
  HostUserEmail,
  HostUserId,
  IHostUserPrimitives,
  IHostUserRepository,
  Nullable,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';
import { Model } from 'mongoose';

import { IMongooseHostUserDocument } from './IMongooseHostUserDocument';
import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseHostUserSchema } from './mongoose-host-user.schema';

type Dependencies = {
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
};

export class MongooseHostUserRepository
  extends MongooseRepository<IHostUserPrimitives, HostUser>
  implements IHostUserRepository {
  readonly #securePasswordCreationDomainService: SecurePasswordCreationDomainService;

  protected collectionName(): string {
    return 'host_user';
  }

  private constructor(dependencies: Dependencies) {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseHostUserSchema,
    });

    this.#securePasswordCreationDomainService = dependencies.securePasswordCreationDomainService;
  }

  public static create(dependencies: Dependencies): MongooseHostUserRepository {
    return new MongooseHostUserRepository(dependencies);
  }

  public async find(): Promise<Nullable<HostUser>> {
    const MyModel = await this.model();
    const documentList = await MyModel.find<IMongooseHostUserDocument>();
    if (documentList.length === 0) return null;
    const document = documentList[0];
    return document === null ? null : this.#mapDocumentToHostUser(document);
  }

  public async findById(hostUserId: HostUserId): Promise<Nullable<HostUser>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseHostUserDocument> = await MyModel.findOne<IMongooseHostUserDocument>({ id: hostUserId.value });
    return document === null ? null : this.#mapDocumentToHostUser(document);
  }

  public async findByEmail(hostUserEmail: HostUserEmail): Promise<Nullable<HostUser>> {
    const MyModel = await this.model();
    const document = await MyModel.findOne<IMongooseHostUserDocument>({ 'email.value': hostUserEmail.value.value });
    return document === null ? null : this.#mapDocumentToHostUser(document);
  }

  public save(hostUser: HostUser): Promise<void> {
    return this.persist(hostUser);
  }

  protected override async persist(aggregate: HostUser): Promise<void> {
    const MyModel:Model<{ [key: string]: any }> = await this.model();
    const userHashedPassword = await this.#securePasswordCreationDomainService.createFromPlainText(aggregate.password);

    const {
      id,
      password,
      ...props
    } = aggregate.toPrimitives;

    await MyModel.updateOne({ id }, { password: userHashedPassword.value, ...props }, { upsert: true });
  }

  #mapDocumentToHostUser(document: IMongooseHostUserDocument): HostUser {
    return HostUser.fromPrimitives(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      document.password.valueOf(),
      document.gender.valueOf(),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      {
        url: document.profileImage.url.valueOf(),
        uploadedAt: document.profileImage.uploadedAt.valueOf(),
        alt: document.profileImage.alt.valueOf(),
        dimensions: { width: document.profileImage.dimensions.width.valueOf(), height: document.profileImage.dimensions.height.valueOf() },
      },
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
