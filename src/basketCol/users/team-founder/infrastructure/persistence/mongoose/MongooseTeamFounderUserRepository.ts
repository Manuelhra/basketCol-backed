import {
  ITeamFounderUser,
  ITeamFounderUserRepository,
  Nullable,
  SecurePasswordCreationService,
  TeamFounderUser,
  TeamFounderUserId,
  TeamFounderUserEmail,
} from '@basketcol/domain';
import { Mongoose, Schema } from 'mongoose';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseTeamFounderUserDocument } from './IMongooseTeamFounderUserDocument';

export class MongooseTeamFounderUserRepository extends MongooseRepository<ITeamFounderUser, TeamFounderUser> implements ITeamFounderUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'team-founder-user';
  }

  constructor(dependencies: {
    mongooseClient: Promise<Mongoose>;
    teamFounderUserMongooseSchema: Schema<IMongooseTeamFounderUserDocument>;
    securePasswordCreationService: SecurePasswordCreationService;
  }) {
    super({
      mongooseClient: dependencies.mongooseClient,
      mongooseSchema: dependencies.teamFounderUserMongooseSchema,
    });

    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
  }

  public async searchById(teamFounderUserId: TeamFounderUserId): Promise<Nullable<TeamFounderUser>> {
    const Model = await this.model();

    const document: Nullable<IMongooseTeamFounderUserDocument> = await Model.findById<IMongooseTeamFounderUserDocument>(teamFounderUserId.value);

    return document === null ? null : TeamFounderUser.create(
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

  public async searchByEmail(teamFounderUserEmail: TeamFounderUserEmail): Promise<Nullable<TeamFounderUser>> {
    const Model = await this.model();

    const document: Nullable<IMongooseTeamFounderUserDocument> = await Model.findOne<IMongooseTeamFounderUserDocument>({ 'email.value': teamFounderUserEmail.value.value });

    return document === null ? null : TeamFounderUser.create(
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

  public save(teamFounderUser: TeamFounderUser): Promise<void> {
    return this.persist(teamFounderUser);
  }
}
