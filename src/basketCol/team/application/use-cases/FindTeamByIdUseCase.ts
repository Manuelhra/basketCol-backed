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
import { TeamAllTimeStatsNotFoundForPlayerError } from '../exceptions/TeamAllTimeStatsNotFoundError';

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
      const errorMessage: string = `Team all-time stats not found for team with ID ${team.id.value}`;
      throw TeamAllTimeStatsNotFoundForPlayerError.create(errorMessage);
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
