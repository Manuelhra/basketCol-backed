import {
  IPaginatedResponse,
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
  readonly securePasswordCreationService: SecurePasswordCreationService;
};

export class MongoosePlayerUserRepository
  extends MongooseRepository<IPlayerUserPrimitives, PlayerUser>
  implements IPlayerUserRepository {
  readonly #securePasswordCreationService: SecurePasswordCreationService;

  protected collectionName(): string {
    return 'player_user';
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

  public async findById(playerUserId: PlayerUserId): Promise<Nullable<PlayerUser>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePlayerUserDocument> = await MyModel.findOne<IMongoosePlayerUserDocument>({ id: playerUserId.value });
    return document === null ? null : this.#mapDocumentToPlayerUser(document);
  }

  public async findByEmail(playerUserEmail: PlayerUserEmail): Promise<Nullable<PlayerUser>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePlayerUserDocument> = await MyModel.findOne<IMongoosePlayerUserDocument>({ 'email.value': playerUserEmail.value.value });
    return document === null ? null : this.#mapDocumentToPlayerUser(document);
  }

  public async findByNickname(playerUserNickname: PlayerUserNickname): Promise<Nullable<PlayerUser>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePlayerUserDocument> = await MyModel.findOne<IMongoosePlayerUserDocument>({ nickname: playerUserNickname.value });
    return document === null ? null : this.#mapDocumentToPlayerUser(document);
  }

  public async searchAll(params: { query?: string; page: number; perPage: number; }): Promise<IPaginatedResponse<PlayerUser>> {
    const { query, page, perPage } = params;
    const MyModel = await this.model();
    const skip = (page - 1) * perPage;

    const filter: { $or?: { [key: string]: { $regex: RegExp } }[] } = {};

    if (query) {
      filter.$or = [
        { 'name.firstName': { $regex: new RegExp(query, 'i') } },
        { 'name.lastName': { $regex: new RegExp(query, 'i') } },
        { nickname: { $regex: new RegExp(query, 'i') } },
        { 'email.value': { $regex: new RegExp(query, 'i') } },
      ];
    }

    const [documents, total] = await Promise.all([
      MyModel.find<IMongoosePlayerUserDocument>(filter)
        .skip(skip)
        .limit(perPage)
        .exec(),
      MyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / perPage);
    const playerUsers = documents.map(this.#mapDocumentToPlayerUser);

    return {
      data: playerUsers,
      pagination: {
        currentPage: page,
        perPage,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        firstPage: 1,
        lastPage: totalPages,
      },
    };
  }

  public save(playerUser: PlayerUser): Promise<void> {
    return this.persist(playerUser);
  }

  protected override async persist(aggregate: PlayerUser): Promise<void> {
    const MyModel: Model<{ [key: string]: any }> = await this.model();
    const userHashedPassword = await this.#securePasswordCreationService.createFromPlainText(aggregate.password);

    const {
      id,
      password,
      ...props
    } = aggregate.toPrimitives;

    await MyModel.updateOne({ id }, { password: userHashedPassword.value, ...props }, { upsert: true });
  }

  #mapDocumentToPlayerUser(document: IMongoosePlayerUserDocument): PlayerUser {
    return PlayerUser.fromPrimitives(
      document.id.valueOf(),
      { firstName: document.name.firstName.valueOf(), lastName: document.name.lastName.valueOf() },
      document.biography.valueOf(),
      document.nickname.valueOf(),
      { value: document.email.value.valueOf(), verified: document.email.verified.valueOf() },
      document.password.valueOf(),
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
