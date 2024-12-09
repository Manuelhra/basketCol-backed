import {
  ITeamPlayerPrimitives,
  ITeamPlayerRepository,
  Nullable,
  TeamPlayer,
  TeamPlayerId,
  TeamPlayerPlayerUserId,
  TeamPlayerStatus,
  TeamPlayerTeamId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseTeamPlayerSchema } from './mongoose-team-player.schema';
import { IMongooseTeamPlayerDocument } from './IMongooseTeamPlayerDocument';

export class MongooseTeamPlayerRepository
  extends MongooseRepository<ITeamPlayerPrimitives, TeamPlayer>
  implements ITeamPlayerRepository {
  protected collectionName(): string {
    return 'team_player';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseTeamPlayerSchema,
    });
  }

  public static create(): MongooseTeamPlayerRepository {
    return new MongooseTeamPlayerRepository();
  }

  public async findById(teamPlayerId: TeamPlayerId): Promise<Nullable<TeamPlayer>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamPlayerDocument> = await MyModel.findOne<IMongooseTeamPlayerDocument>({ id: teamPlayerId.value });
    return document === null ? null : this.#mapDocumentToTeamPlayer(document);
  }

  public async findAllActivePlayersByTeamId(teamId: TeamPlayerTeamId): Promise<TeamPlayer[]> {
    const MyModel = await this.model();
    const documents: IMongooseTeamPlayerDocument[] = await MyModel.find<IMongooseTeamPlayerDocument>({
      teamId: teamId.value,
      status: TeamPlayerStatus.active,
    });

    return documents.map((document) => this.#mapDocumentToTeamPlayer(document));
  }

  public async findByTeamIdAndPlayerUserId(teamId: TeamPlayerTeamId, playerUserId: TeamPlayerPlayerUserId): Promise<Nullable<TeamPlayer>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamPlayerDocument> = await MyModel.findOne<IMongooseTeamPlayerDocument>({
      teamId: teamId.value,
      playerUserId: playerUserId.value,
      status: { $ne: TeamPlayerStatus.createTransferred().value },
    });

    return document === null ? null : this.#mapDocumentToTeamPlayer(document);
  }

  public async findTeamActivePlayerByPlayerUserId(playerUserId: TeamPlayerPlayerUserId): Promise<Nullable<TeamPlayer>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseTeamPlayerDocument> = await MyModel.findOne<IMongooseTeamPlayerDocument>({
      playerUserId: playerUserId.value,
      status: TeamPlayerStatus.active,
    });

    return document === null ? null : this.#mapDocumentToTeamPlayer(document);
  }

  public save(teamPlayer: TeamPlayer): Promise<void> {
    return this.persist(teamPlayer);
  }

  #mapDocumentToTeamPlayer(document: ITeamPlayerPrimitives): TeamPlayer {
    return TeamPlayer.fromPrimitives(
      document.id.valueOf(),
      document.teamId.valueOf(),
      document.playerUserId.valueOf(),
      document.status.valueOf(),
      document.jerseyNumber === null ? null : document.jerseyNumber.valueOf(),
      document.position === null ? null : document.position.valueOf(),
      document.joinedAt.valueOf(),
      document.leftAt === null ? null : document.leftAt.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
