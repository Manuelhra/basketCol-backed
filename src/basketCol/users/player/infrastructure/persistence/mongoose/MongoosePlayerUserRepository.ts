import {
  IPlayerUserPrimitives,
  IPlayerUserRepository,
  Nullable,
  PlayerUser,
  PlayerUserEmail,
  PlayerUserId,
  PlayerUserNickname,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Model } from 'mongoose';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongoosePlayerUserDocument } from './IMongoosePlayerUserDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongoosePlayerUserSchema } from './mongoose-player-user.schema';

type Dependencies = {
  securePasswordCreationService: SecurePasswordCreationService;
};

export class MongoosePlayerUserRepository extends MongooseRepository<IPlayerUserPrimitives, PlayerUser> implements IPlayerUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'player-user';
  }

  private constructor(dependencies: Dependencies) {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongoosePlayerUserSchema,
    });

    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
  }

  public static create(dependencies: Dependencies): MongoosePlayerUserRepository {
    return new MongoosePlayerUserRepository(dependencies);
  }

  public async searchById(playerUserId: PlayerUserId): Promise<Nullable<PlayerUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserDocument> = await MyModel.findOne<IMongoosePlayerUserDocument>({ id: playerUserId.value });

    return document === null ? null : PlayerUser.fromPrimitives(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      document.password.valueOf(),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      { url: document.profileImage.url.valueOf(), updatedAt: document.profileImage.updatedAt.valueOf() },
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByEmail(playerUserEmail: PlayerUserEmail): Promise<Nullable<PlayerUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserDocument> = await MyModel.findOne<IMongoosePlayerUserDocument>({ 'email.value': playerUserEmail.value.value });

    return document === null ? null : PlayerUser.fromPrimitives(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      document.password.valueOf(),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      { url: document.profileImage.url.valueOf(), updatedAt: document.profileImage.updatedAt.valueOf() },
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByNickname(playerUserNickname: PlayerUserNickname): Promise<Nullable<PlayerUser>> {
    const MyModel = await this.model();

    const document: Nullable<IMongoosePlayerUserDocument> = await MyModel.findOne<IMongoosePlayerUserDocument>({ nickname: playerUserNickname.value });

    return document === null ? null : PlayerUser.fromPrimitives(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      document.password.valueOf(),
      document.accountStatus.valueOf(),
      document.subscriptionType.valueOf(),
      { url: document.profileImage.url.valueOf(), updatedAt: document.profileImage.updatedAt.valueOf() },
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
    } = aggregate.toPrimitives;

    await MyModel.updateOne({ id }, { password: userHashedPassword.value, ...props }, { upsert: true });
  }
}
