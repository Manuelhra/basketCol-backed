import {
  ITeamFounderUserPrimitives,
  ITeamFounderUserRepository,
  Nullable,
  SecurePasswordCreationDomainService,
  TeamFounderUser,
  TeamFounderUserId,
  TeamFounderUserEmail,
} from '@basketcol/domain';
import { Model } from 'mongoose';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseTeamFounderUserDocument } from './IMongooseTeamFounderUserDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseTeamFounderUserSchema } from './mongoose-team-founder-user.schema';

type Dependencies = {
  readonly securePasswordCreationDomainService: SecurePasswordCreationDomainService;
};

export class MongooseTeamFounderUserRepository
  extends MongooseRepository<ITeamFounderUserPrimitives, TeamFounderUser>
  implements ITeamFounderUserRepository {
  readonly #securePasswordCreationDomainService: SecurePasswordCreationDomainService;

  protected collectionName(): string {
    return 'team-founder-user';
  }

  private constructor(dependencies: Dependencies) {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseTeamFounderUserSchema,
    });

    this.#securePasswordCreationDomainService = dependencies.securePasswordCreationDomainService;
  }

  public static create(dependencies: Dependencies): MongooseTeamFounderUserRepository {
    return new MongooseTeamFounderUserRepository(dependencies);
  }

  public async findById(teamFounderUserId: TeamFounderUserId): Promise<Nullable<TeamFounderUser>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamFounderUserDocument> = await MyModel.findOne<IMongooseTeamFounderUserDocument>({ id: teamFounderUserId.value });
    return document === null ? null : this.#mapDocumentToTeamFounderUser(document);
  }

  public async findByEmail(teamFounderUserEmail: TeamFounderUserEmail): Promise<Nullable<TeamFounderUser>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamFounderUserDocument> = await MyModel.findOne<IMongooseTeamFounderUserDocument>({ 'email.value': teamFounderUserEmail.value.value });
    return document === null ? null : this.#mapDocumentToTeamFounderUser(document);
  }

  public save(teamFounderUser: TeamFounderUser): Promise<void> {
    return this.persist(teamFounderUser);
  }

  protected override async persist(aggregate: TeamFounderUser): Promise<void> {
    const MyModel:Model<{ [key: string]: any }> = await this.model();
    const userHashedPassword = await this.#securePasswordCreationDomainService.createFromPlainText(aggregate.password);

    const {
      id,
      password,
      ...props
    } = aggregate.toPrimitives;

    await MyModel.updateOne({ id }, { password: userHashedPassword.value, ...props }, { upsert: true });
  }

  #mapDocumentToTeamFounderUser(document: IMongooseTeamFounderUserDocument): TeamFounderUser {
    return TeamFounderUser.fromPrimitives(
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
