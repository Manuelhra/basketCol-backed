import {
  ITeamAllTimeStatsRepository,
  ITeamRepository,
  Nullable,
  Team,
  TeamAllTimeStats,
  TeamId,
} from '@basketcol/domain';

import { IFindTeamByIdUseCase, IFindTeamByIdUseCaseResponse } from './ports/IFindTeamByIdUseCase';
import { FindTeamByIdDTO } from '../dtos/FindTeamByIdDTO';
import { TeamAllTimeStatsNotFoundError } from '../../all-time-stats/application/exceptions/TeamAllTimeStatsNotFoundError';

type Dependencies = {
  readonly teamRepository: ITeamRepository;
  readonly teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;
};

export class FindTeamByIdUseCase implements IFindTeamByIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindTeamByIdUseCase {
    return new FindTeamByIdUseCase(dependencies);
  }

  public async execute(dto: FindTeamByIdDTO): Promise<IFindTeamByIdUseCaseResponse> {
    const teamId: TeamId = TeamId.create(dto.id);
    const team: Nullable<Team> = await this.dependencies.teamRepository.findById(teamId);

    if (team === null || team === undefined) {
      return this.#emptyResponse();
    }

    const teamAllTimeStats: Nullable<TeamAllTimeStats> = await this.dependencies.teamAllTimeStatsRepository.findByTeamId(team.id);

    if (teamAllTimeStats === null || teamAllTimeStats === undefined) {
      throw TeamAllTimeStatsNotFoundError.create(team.id);
    }

    return {
      team,
      teamAllTimeStats,
    };
  }

  #emptyResponse(): IFindTeamByIdUseCaseResponse {
    return null;
  }
}
