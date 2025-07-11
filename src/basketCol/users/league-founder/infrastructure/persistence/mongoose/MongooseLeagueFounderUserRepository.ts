import {
  ILeagueFounderUserPrimitives,
  ILeagueFounderUserRepository,
  LeagueFounderUser,
  LeagueFounderUserEmail,
  LeagueFounderUserId,
  Nullable,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';
import { Model } from 'mongoose';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseLeagueFounderUserDocument } from './IMongooseLeagueFounderUserDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseLeagueFounderUserSchema } from './mongoose-league-founder-user.schema';

type Dependencies = {
  readonly securePasswordCreationDomainService: SecurePasswordCreationDomainService;
};

export class MongooseLeagueFounderUserRepository
  extends MongooseRepository<ILeagueFounderUserPrimitives, LeagueFounderUser>
  implements ILeagueFounderUserRepository {
  readonly #securePasswordCreationDomainService: SecurePasswordCreationDomainService;

  protected collectionName(): string {
    return 'league-founder-user';
  }

  private constructor(dependencies: Dependencies) {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseLeagueFounderUserSchema,
    });

    this.#securePasswordCreationDomainService = dependencies.securePasswordCreationDomainService;
  }

  public static create(dependencies: Dependencies): MongooseLeagueFounderUserRepository {
    return new MongooseLeagueFounderUserRepository(dependencies);
  }

  public async findById(leagueFounderUserId: LeagueFounderUserId): Promise<Nullable<LeagueFounderUser>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueFounderUserDocument> = await MyModel.findOne<IMongooseLeagueFounderUserDocument>({ id: leagueFounderUserId.value });
    return document === null ? null : this.#mapDocumentToLeagueFounderUser(document);
  }

  public async findByEmail(leagueFounderUserEmail: LeagueFounderUserEmail): Promise<Nullable<LeagueFounderUser>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueFounderUserDocument> = await MyModel.findOne<IMongooseLeagueFounderUserDocument>({ 'email.value': leagueFounderUserEmail.value.value });
    return document === null ? null : this.#mapDocumentToLeagueFounderUser(document);
  }

  public save(leagueFounderUser: LeagueFounderUser): Promise<void> {
    return this.persist(leagueFounderUser);
  }

  protected override async persist(aggregate: LeagueFounderUser): Promise<void> {
    const MyModel:Model<{ [key: string]: any }> = await this.model();
    const userHashedPassword = await this.#securePasswordCreationDomainService.createFromPlainText(aggregate.password);

    const {
      id,
      password,
      ...props
    } = aggregate.toPrimitives;

    await MyModel.updateOne({ id }, { password: userHashedPassword.value, ...props }, { upsert: true });
  }

  #mapDocumentToLeagueFounderUser(document: IMongooseLeagueFounderUserDocument): LeagueFounderUser {
    return LeagueFounderUser.fromPrimitives(
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
