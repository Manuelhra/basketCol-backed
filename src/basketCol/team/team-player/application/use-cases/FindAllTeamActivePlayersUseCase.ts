import {
  IPlayerUserRepository,
  ITeamPlayerRepository,
  ITeamRepository,
  Nullable,
  PlayerUser,
  PlayerUserId,
  Team,
  TeamNotFoundError,
  TeamPlayer,
  TeamPlayerTeamId,
} from '@basketcol/domain';

import {
  IFindAllTeamActivePlayersUseCase,
  IFindAllTeamActivePlayersUseCaseResponse,
} from './ports/IFindAllTeamActivePlayersUseCase';

import { FindAllTeamActivePlayersDTO } from '../dtos/FindAllTeamActivePlayersDTO';

interface Dependencies {
  readonly teamPlayerRepository: ITeamPlayerRepository;
  readonly teamRepository: ITeamRepository;
  readonly playerUserRepository: IPlayerUserRepository;
}

export class FindAllTeamActivePlayersUseCase implements IFindAllTeamActivePlayersUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindAllTeamActivePlayersUseCase {
    return new FindAllTeamActivePlayersUseCase(dependencies);
  }

  public async execute(dto: FindAllTeamActivePlayersDTO): Promise<IFindAllTeamActivePlayersUseCaseResponse> {
    const teamId = TeamPlayerTeamId.create(dto.teamId);

    const [teamPlayers, team] = await this.#fetchTeamPlayersAndTeam(teamId);
    const playerUserList = (await this.#fetchPlayerUsers(teamPlayers)).filter((playerUser): playerUser is PlayerUser => playerUser !== undefined);

    return {
      teamPlayers,
      teamInfo: team,
      playerUserList,
    };
  }

  async #fetchTeamPlayersAndTeam(teamId: TeamPlayerTeamId): Promise<[TeamPlayer[], Team]> {
    const teamPlayers = await this.dependencies.teamPlayerRepository.findAllActivePlayersByTeamId(teamId);

    const team = await this.dependencies.teamRepository.findById(teamId);
    if (!team) {
      throw TeamNotFoundError.create(teamId);
    }

    return [teamPlayers, team];
  }

  async #fetchPlayerUsers(teamPlayers: TeamPlayer[]): Promise<Nullable<PlayerUser>[]> {
    const playerUserPromises = teamPlayers.map((teamPlayer) => this.dependencies.playerUserRepository.findById(
      PlayerUserId.create(teamPlayer.toPrimitives.playerUserId),
    ));

    return Promise.all(playerUserPromises);
  }
}
