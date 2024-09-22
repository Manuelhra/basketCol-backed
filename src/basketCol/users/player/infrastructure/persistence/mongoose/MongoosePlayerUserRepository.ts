import {
  IPlayerUser,
  IPlayerUserRepository,
  Nullable,
  PlayerUser,
  PlayerUserEmail,
  PlayerUserId,
  PlayerUserNickname,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Model, Mongoose, Schema } from 'mongoose';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongoosePlayerUserDocument } from './IMongoosePlayerUserDocument';

export class MongoosePlayerUserRepository extends MongooseRepository<IPlayerUser, PlayerUser> implements IPlayerUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'player-user';
  }

  constructor(dependencies: {
    mongooseClient: Promise<Mongoose>;
    playerUserMongooseSchema: Schema<IMongoosePlayerUserDocument>;
    securePasswordCreationService: SecurePasswordCreationService;
  }) {
    super({
      mongooseClient: dependencies.mongooseClient,
      mongooseSchema: dependencies.playerUserMongooseSchema,
    });

    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
  }

  public async searchById(playerUserId: PlayerUserId): Promise<Nullable<PlayerUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserDocument> = await MyModel.findById<IMongoosePlayerUserDocument>(playerUserId.value);

    return document === null ? null : PlayerUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByEmail(playerUserEmail: PlayerUserEmail): Promise<Nullable<PlayerUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserDocument> = await MyModel.findOne<IMongoosePlayerUserDocument>({ 'email.value': playerUserEmail.value.value });

    return document === null ? null : PlayerUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByNickname(playerUserNickname: PlayerUserNickname): Promise<Nullable<PlayerUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserDocument> = await MyModel.findOne<IMongoosePlayerUserDocument>({ nickname: playerUserNickname.value });

    return document === null ? null : PlayerUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      await this.createSecurePassword(document.password.valueOf()),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(playerUser: PlayerUser): Promise<void> {
    return this.persist(playerUser);
  }

  protected override async persist(aggregate: PlayerUser): Promise<void> {
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
