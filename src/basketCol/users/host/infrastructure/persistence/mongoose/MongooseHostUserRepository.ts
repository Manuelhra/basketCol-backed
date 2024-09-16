import {
  HostUser,
  HostUserEmail,
  HostUserId,
  IHostUser,
  IHostUserRepository,
  Nullable,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Mongoose, Schema } from 'mongoose';

import { IMongooseHostUserDocument } from './IMongooseHostUserDocument';
import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';

export class MongooseHostUserRepository extends MongooseRepository<IHostUser, HostUser> implements IHostUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'host-user';
  }

  constructor(dependencies: {
    mongooseClient: Promise<Mongoose>;
    hostUserMongooseSchema: Schema<IMongooseHostUserDocument>;
    securePasswordCreationService: SecurePasswordCreationService;
  }) {
    super({
      mongooseClient: dependencies.mongooseClient,
      mongooseSchema: dependencies.hostUserMongooseSchema,
    });

    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
  }

  public async search(): Promise<Nullable<HostUser>> {
    const Model = await this.model();

    const documentList = await Model.find<IMongooseHostUserDocument>();

    if (documentList.length === 0) return null;

    const document = documentList[0];

    return document === null ? null : HostUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      this.#securePasswordCreationService.createFromHashedText(document.password.valueOf()).value,
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchById(hostUserId: HostUserId): Promise<Nullable<HostUser>> {
    const Model = await this.model();

    const document: Nullable<IMongooseHostUserDocument> = await Model.findById<IMongooseHostUserDocument>(hostUserId.value);

    return document === null ? null : HostUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      this.#securePasswordCreationService.createFromHashedText(document.password.valueOf()).value,
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByEmail(hostUserEmail: HostUserEmail): Promise<Nullable<HostUser>> {
    const Model = await this.model();

    const document = await Model.findOne<IMongooseHostUserDocument>({ 'email.value': hostUserEmail.value.value });

    return document === null ? null : HostUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      this.#securePasswordCreationService.createFromHashedText(document.password.valueOf()).value,
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(hostUser: HostUser): Promise<void> {
    return this.persist(hostUser);
  }
}
