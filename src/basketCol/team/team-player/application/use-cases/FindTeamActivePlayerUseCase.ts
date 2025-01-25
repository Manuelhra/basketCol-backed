import {
  IPlayerUserCareerStatsRepository,
  IPlayerUserRepository,
  ITeamPlayerRepository,
  ITeamRepository,
  Nullable,
  PlayerUser,
  PlayerUserCareerStats,
  Team,
  TeamId,
  TeamNotFoundError,
  TeamPlayer,
  TeamPlayerPlayerUserId,
} from '@basketcol/domain';

import { IFindTeamActivePlayerUseCase, IFindTeamActivePlayerUseCaseResponse } from './ports/IFindTeamActivePlayerUseCase';
import { FindTeamActivePlayerDTO } from '../dtos/FindTeamActivePlayerDTO';
import { PlayerUserNotFoundForTeamPlayerError } from '../exceptions/PlayerUserNotFoundForTeamPlayerError';

type Dependencies = {
  readonly teamPlayerRepository: ITeamPlayerRepository;
  readonly teamRepository: ITeamRepository;
  readonly playerUserRepository: IPlayerUserRepository;
  readonly playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
};

export class FindTeamActivePlayerUseCase implements IFindTeamActivePlayerUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindTeamActivePlayerUseCase {
    return new FindTeamActivePlayerUseCase(dependencies);
  }

  public async execute(dto: FindTeamActivePlayerDTO): Promise<IFindTeamActivePlayerUseCaseResponse> {
    const playerUserId = TeamPlayerPlayerUserId.create(dto.playerUserId);
    const teamPlayer: Nullable<TeamPlayer> = await this.#findTeamPlayer(playerUserId);

    if (teamPlayer === null || teamPlayer === undefined) {
      return this.#emptyResponse();
    }

    const teamInfo = await this.#findTeamInfo(teamPlayer);
    const playerUserInfo = await this.#findPlayerUserInfo(playerUserId, teamPlayer);

    const playerUserCareerStats: Nullable<PlayerUserCareerStats> = await this.dependencies.playerUserCareerStatsRepository.findByPlayerUserId(playerUserId);

    if (playerUserCareerStats === undefined || playerUserCareerStats === null) {
      return null;
    }

    return {
      teamPlayer,
      teamInfo,
      playerUserInfo,
      playerUserCareerStats,
    };
  }

  async #findTeamPlayer(playerUserId: TeamPlayerPlayerUserId): Promise<Nullable<TeamPlayer>> {
    return this.dependencies.teamPlayerRepository.findTeamActivePlayerByPlayerUserId(playerUserId);
  }

  async #findTeamInfo(teamPlayer: TeamPlayer): Promise<Team> {
    const teamId = TeamId.create(teamPlayer.toPrimitives.teamId);
    const teamInfo = await this.dependencies.teamRepository.findById(teamId);

    if (teamInfo === null || teamInfo === undefined) {
      throw TeamNotFoundError.create(teamId);
    }

    return teamInfo;
  }

  async #findPlayerUserInfo(playerUserId: TeamPlayerPlayerUserId, teamPlayer: TeamPlayer): Promise<PlayerUser> {
    const playerUserInfo: Nullable<PlayerUser> = await this.dependencies.playerUserRepository.findById(playerUserId);

    if (playerUserInfo === null || playerUserInfo === undefined) {
      throw PlayerUserNotFoundForTeamPlayerError.create(teamPlayer.toPrimitives.teamId);
    }

    return playerUserInfo;
  }

  #emptyResponse(): IFindTeamActivePlayerUseCaseResponse {
    return null;
  }
}
