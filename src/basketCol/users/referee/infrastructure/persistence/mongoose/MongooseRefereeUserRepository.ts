import {
  IRefereeUser,
  IRefereeUserRepository,
  Nullable,
  RefereeUser,
  RefereeUserEmail,
  RefereeUserId,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Mongoose, Schema } from 'mongoose';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseRefereeUserDocument } from './IMongooseRefereeUserDocument';

export class MongooseRefereeUserRepository extends MongooseRepository<IRefereeUser, RefereeUser> implements IRefereeUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'referee-user';
  }

  constructor(dependencies: {
    mongooseClient: Promise<Mongoose>;
    refereeUserMongooseSchema: Schema<IMongooseRefereeUserDocument>;
    securePasswordCreationService: SecurePasswordCreationService;
  }) {
    super({
      mongooseClient: dependencies.mongooseClient,
      mongooseSchema: dependencies.refereeUserMongooseSchema,
    });

    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
  }

  public async searchById(refereeUserId: RefereeUserId): Promise<Nullable<RefereeUser>> {
    const Model = await this.model();

    const document: Nullable<IMongooseRefereeUserDocument> = await Model.findById<IMongooseRefereeUserDocument>(refereeUserId.value);

    return document === null ? null : RefereeUser.create(
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

  public async searchByEmail(refereeUserEmail: RefereeUserEmail): Promise<Nullable<RefereeUser>> {
    const Model = await this.model();

    const document: Nullable<IMongooseRefereeUserDocument> = await Model.findOne<IMongooseRefereeUserDocument>({ 'email.value': refereeUserEmail.value.value });

    return document === null ? null : RefereeUser.create(
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

  public save(refereeUser: RefereeUser): Promise<void> {
    return this.persist(refereeUser);
  }
}
