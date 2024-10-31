import {
  IRefereeUserPrimitives,
  IRefereeUserRepository,
  Nullable,
  RefereeUser,
  RefereeUserEmail,
  RefereeUserId,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Model } from 'mongoose';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseRefereeUserDocument } from './IMongooseRefereeUserDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseRefereeUserSchema } from './mongoose-referee-user.schema';

type Dependencies = {
  securePasswordCreationService: SecurePasswordCreationService;
};

export class MongooseRefereeUserRepository extends MongooseRepository<IRefereeUserPrimitives, RefereeUser> implements IRefereeUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'referee-user';
  }

  private constructor(dependencies: Dependencies) {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseRefereeUserSchema,
    });

    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
  }

  public static create(dependencies: Dependencies): MongooseRefereeUserRepository {
    return new MongooseRefereeUserRepository(dependencies);
  }

  public async searchById(refereeUserId: RefereeUserId): Promise<Nullable<RefereeUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseRefereeUserDocument> = await MyModel.findOne<IMongooseRefereeUserDocument>({ id: refereeUserId.value });

    return document === null ? null : RefereeUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.#createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      { url: document.profileImage.url.valueOf(), updatedAt: document.profileImage.updatedAt.valueOf() },
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByEmail(refereeUserEmail: RefereeUserEmail): Promise<Nullable<RefereeUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseRefereeUserDocument> = await MyModel.findOne<IMongooseRefereeUserDocument>({ 'email.value': refereeUserEmail.value.value });

    return document === null ? null : RefereeUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.#createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      { url: document.profileImage.url.valueOf(), updatedAt: document.profileImage.updatedAt.valueOf() },
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(refereeUser: RefereeUser): Promise<void> {
    return this.persist(refereeUser);
  }

  protected override async persist(aggregate: RefereeUser): Promise<void> {
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
