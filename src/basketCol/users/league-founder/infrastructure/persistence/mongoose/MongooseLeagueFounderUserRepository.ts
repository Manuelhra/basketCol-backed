import {
  ILeagueFounderUserPrimitives,
  ILeagueFounderUserRepository,
  LeagueFounderUser,
  LeagueFounderUserEmail,
  LeagueFounderUserId,
  Nullable,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Model } from 'mongoose';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseLeagueFounderUserDocument } from './IMongooseLeagueFounderUserDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseLeagueFounderUserSchema } from './mongoose-league-founder-user.schema';

type Dependencies = {
  securePasswordCreationService: SecurePasswordCreationService;
};

export class MongooseLeagueFounderUserRepository extends MongooseRepository<ILeagueFounderUserPrimitives, LeagueFounderUser> implements ILeagueFounderUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'league-founder-user';
  }

  private constructor(dependencies: Dependencies) {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseLeagueFounderUserSchema,
    });

    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
  }

  public static create(dependencies: Dependencies): MongooseLeagueFounderUserRepository {
    return new MongooseLeagueFounderUserRepository(dependencies);
  }

  public async searchById(leagueFounderUserId: LeagueFounderUserId): Promise<Nullable<LeagueFounderUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseLeagueFounderUserDocument> = await MyModel.findOne<IMongooseLeagueFounderUserDocument>({ id: leagueFounderUserId.value });

    return document === null ? null : LeagueFounderUser.create(
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

  public async searchByEmail(leagueFounderUserEmail: LeagueFounderUserEmail): Promise<Nullable<LeagueFounderUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseLeagueFounderUserDocument> = await MyModel.findOne<IMongooseLeagueFounderUserDocument>({ 'email.value': leagueFounderUserEmail.value.value });

    return document === null ? null : LeagueFounderUser.create(
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

  public save(leagueFounderUser: LeagueFounderUser): Promise<void> {
    return this.persist(leagueFounderUser);
  }

  protected override async persist(aggregate: LeagueFounderUser): Promise<void> {
    const MyModel:Model<{ [key: string]: any }> = await this.model();
    const userHashedPassword = await this.#securePasswordCreationService.createFromPlainText(aggregate.password);

    const {
      id,
      password,
      ...props
    } = aggregate.toPrimitives();

    await MyModel.updateOne({ id }, { password: userHashedPassword.value, ...props }, { upsert: true });
  }

  async #createSecurePassword(hashedPassword: string): Promise<string> {
    const securePassword = await this.#securePasswordCreationService.createFromHashedText(hashedPassword);
    return securePassword.value;
  }
}
