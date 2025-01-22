import {
  BusinessDateDomainService,
  HostUserType,
  ITeamAllTimeStatsRepository,
  ITeamRepository,
  Nullable,
  TATStatsTeamId,
  TATStatsUpdatedAt,
  TeamAllTimeStats,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UpdateTeamAllTimeStatsAfterGameDTO } from '../dtos/UpdateTeamAllTimeStatsAfterGameDTO';
import { IUpdateTeamAllTimeStatsAfterGameUseCase } from './ports/IUpdateTeamAllTimeStatsAfterGameUseCase';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';
import { TeamAllTimeStatsNotFoundError } from '../exceptions/TeamAllTimeStatsNotFoundError';

type Dependencies = {
  readonly teamRepository: ITeamRepository;
  readonly teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;
  readonly teamValidationDomainService: TeamValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
};

export class UpdateTeamAllTimeStatsAfterGameUseCase implements IUpdateTeamAllTimeStatsAfterGameUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public async execute(dto: UpdateTeamAllTimeStatsAfterGameDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'update a team all-time stats');
    }

    const {
      hasWonGame,
      points,
      offensiveRebounds,
      defensiveRebounds,
      assists,
      steals,
      blocks,
      fouls,
      turnovers,
      threePointersAttempted,
      threePointersMade,
      freeThrowsAttempted,
      freeThrowsMade,
      fieldGoalsAttempted,
      fieldGoalsMade,
      teamId,
    } = dto;

    const tATStatsTeamId: TATStatsTeamId = TATStatsTeamId.create(teamId);
    const tATStatsUpdatedAt: TATStatsUpdatedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    await this.dependencies.teamValidationDomainService.ensureTeamExists(tATStatsTeamId);

    const teamAllTimeStats: Nullable<TeamAllTimeStats> = await this.dependencies.teamAllTimeStatsRepository.findByTeamId(tATStatsTeamId);

    if (teamAllTimeStats === null || teamAllTimeStats === undefined) {
      throw TeamAllTimeStatsNotFoundError.create(tATStatsTeamId);
    }

    const updatedTeamAllTimeStats = teamAllTimeStats.incrementStatsAfterGame(
      hasWonGame,
      points,
      offensiveRebounds,
      defensiveRebounds,
      assists,
      steals,
      blocks,
      fouls,
      turnovers,
      threePointersAttempted,
      threePointersMade,
      freeThrowsAttempted,
      freeThrowsMade,
      fieldGoalsAttempted,
      fieldGoalsMade,
      tATStatsUpdatedAt.value,
    );

    return this.dependencies.teamAllTimeStatsRepository.update(updatedTeamAllTimeStats);
  }
}
