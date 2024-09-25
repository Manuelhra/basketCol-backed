import {
  ITeamFounderUser,
  ITeamFounderUserRepository,
  Nullable,
  SecurePasswordCreationService,
  TeamFounderUser,
  TeamFounderUserId,
  TeamFounderUserEmail,
} from '@basketcol/domain';
import { Model } from 'mongoose';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseTeamFounderUserDocument } from './IMongooseTeamFounderUserDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseTeamFounderUserSchema } from './mongoose-team-founder-user.schema';

export class MongooseTeamFounderUserRepository extends MongooseRepository<ITeamFounderUser, TeamFounderUser> implements ITeamFounderUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'team-founder-user';
  }

  constructor(dependencies: {
    securePasswordCreationService: SecurePasswordCreationService;
  }) {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseTeamFounderUserSchema,
    });

    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
  }

  public async searchById(teamFounderUserId: TeamFounderUserId): Promise<Nullable<TeamFounderUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseTeamFounderUserDocument> = await MyModel.findOne<IMongooseTeamFounderUserDocument>({ id: teamFounderUserId.value });

    return document === null ? null : TeamFounderUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByEmail(teamFounderUserEmail: TeamFounderUserEmail): Promise<Nullable<TeamFounderUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseTeamFounderUserDocument> = await MyModel.findOne<IMongooseTeamFounderUserDocument>({ 'email.value': teamFounderUserEmail.value.value });

    return document === null ? null : TeamFounderUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(teamFounderUser: TeamFounderUser): Promise<void> {
    return this.persist(teamFounderUser);
  }

  protected override async persist(aggregate: TeamFounderUser): Promise<void> {
    const MyModel:Model<{ [key: string]: any }> = await this.model();
    const userHashedPassword = await this.#securePasswordCreationService.createFromPlainText(aggregate.password);

    const {
      id,
      password,
      ...props
    } = aggregate.toPrimitives();

    await MyModel.updateOne({ id }, { password: userHashedPassword.value, ...props }, { upsert: true });
  }

  private async createSecurePassword(hashedPassword: string): Promise<string> {
    const securePassword = await this.#securePasswordCreationService.createFromHashedText(hashedPassword);
    return securePassword.value;
  }
}
