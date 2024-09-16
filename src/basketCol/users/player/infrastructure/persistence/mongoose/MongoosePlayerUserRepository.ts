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
import { Mongoose, Schema } from 'mongoose';

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
    const Model = await this.model();

    const document: Nullable<IMongoosePlayerUserDocument> = await Model.findById<IMongoosePlayerUserDocument>(playerUserId.value);

    return document === null ? null : PlayerUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      this.#securePasswordCreationService.createFromHashedText(document.password.valueOf()).value,
      document.active.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByEmail(playerUserEmail: PlayerUserEmail): Promise<Nullable<PlayerUser>> {
    const Model = await this.model();

    const document: Nullable<IMongoosePlayerUserDocument> = await Model.findOne<IMongoosePlayerUserDocument>({ 'email.value': playerUserEmail.value.value });

    return document === null ? null : PlayerUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      this.#securePasswordCreationService.createFromHashedText(document.password.valueOf()).value,
      document.active.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByNickname(playerUserNickname: PlayerUserNickname): Promise<Nullable<PlayerUser>> {
    const Model = await this.model();

    const document: Nullable<IMongoosePlayerUserDocument> = await Model.findOne<IMongoosePlayerUserDocument>({ nickname: playerUserNickname.value });

    return document === null ? null : PlayerUser.create(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      this.#securePasswordCreationService.createFromHashedText(document.password.valueOf()).value,
      document.active.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(playerUser: PlayerUser): Promise<void> {
    return this.persist(playerUser);
  }
}

// TODO: Cambiar la propiedad active las props de abajo en los documentos de los usuarios
//   private accountStatus: AccountStatus;
// private deletedAt: DateTime | null;
