import {
  HostUser,
  HostUserEmail,
  HostUserId,
  IHostUserPrimitives,
  IHostUserRepository,
  Nullable,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Model } from 'mongoose';

import { IMongooseHostUserDocument } from './IMongooseHostUserDocument';
import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseHostUserSchema } from './mongoose-host-user.schema';

type Dependencies = {
  securePasswordCreationService: SecurePasswordCreationService;
};

export class MongooseHostUserRepository extends MongooseRepository<IHostUserPrimitives, HostUser> implements IHostUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'host-user';
  }

  private constructor(dependencies: Dependencies) {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseHostUserSchema,
    });

    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
  }

  public static create(dependencies: Dependencies): MongooseHostUserRepository {
    return new MongooseHostUserRepository(dependencies);
  }

  public async search(): Promise<Nullable<HostUser>> {
    const MyModel = await this.model();

    const documentList = await MyModel.find<IMongooseHostUserDocument>();

    if (documentList.length === 0) return null;

    const document = documentList[0];

    return document === null ? null : HostUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.#createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchById(hostUserId: HostUserId): Promise<Nullable<HostUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseHostUserDocument> = await MyModel.findOne<IMongooseHostUserDocument>({ id: hostUserId.value });

    return document === null ? null : HostUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.#createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByEmail(hostUserEmail: HostUserEmail): Promise<Nullable<HostUser>> {
    const MyModel = await this.model();

    const document = await MyModel.findOne<IMongooseHostUserDocument>({ 'email.value': hostUserEmail.value.value });

    return document === null ? null : HostUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.#createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(hostUser: HostUser): Promise<void> {
    return this.persist(hostUser);
  }

  protected override async persist(aggregate: HostUser): Promise<void> {
    const MyModel:Model<{ [key: string]: any }> = await this.model();
    const userHashedPassword = await this.#securePasswordCreationService.createFromPlainText(aggregate.password);

    const {
      id,
      password,
      ...props
    } = aggregate.toPrimitives;

    await MyModel.updateOne({ id }, { password: userHashedPassword.value, ...props }, { upsert: true });
  }

  async #createSecurePassword(hashedPassword: string): Promise<string> {
    const securePassword = await this.#securePasswordCreationService.createFromHashedText(hashedPassword);
    return securePassword.value;
  }
}
