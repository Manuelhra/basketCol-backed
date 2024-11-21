import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  ITeamAllTimeStatsPrimitives,
  ITeamAllTimeStatsRepository,
  TATStatsCreatedAt,
  TATStatsId,
  TATStatsTeamId,
  TATStatsUpdatedAt,
  TeamAllTimeStats,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { CreateTeamAllTimeStatsDTO } from '../dtos/CreateTeamAllTimeStatsDTO';
import { ICreateTeamAllTimeStatsUseCase } from './ports/ICreateTeamAllTimeStatsUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  teamValidationDomainService: TeamValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;
};

export class CreateTeamAllTimeStatsUseCase implements ICreateTeamAllTimeStatsUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #teamValidationDomainService: TeamValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#teamValidationDomainService = dependencies.teamValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#teamAllTimeStatsRepository = dependencies.teamAllTimeStatsRepository;
  }

  public static create(dependencies: Dependencies): CreateTeamAllTimeStatsUseCase {
    return new CreateTeamAllTimeStatsUseCase(dependencies);
  }

  public async execute(dto: CreateTeamAllTimeStatsDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a team all-time stats');
    }

    const {
      id,
      totalGamesPlayed,
      totalGamesWon,
      totalSeasonsLeaguePlayed,
      totalSeasonsLeagueWon,
      totalPoints,
      totalOffensiveRebounds,
      totalDefensiveRebounds,
      totalAssists,
      totalSteals,
      totalBlocks,
      totalFouls,
      totalTurnovers,
      totalThreePointersAttempted,
      totalThreePointersMade,
      totalFreeThrowsAttempted,
      totalFreeThrowsMade,
      totalFieldGoalsAttempted,
      totalFieldGoalsMade,
      teamId,
    } = dto;

    const tATStatsId: TATStatsId = TATStatsId.create(id);
    const tATStatsTeamId: TATStatsTeamId = TATStatsTeamId.create(teamId);

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<TATStatsId, ITeamAllTimeStatsPrimitives, TeamAllTimeStats>(tATStatsId);
    await this.#teamValidationDomainService.ensureTeamExists(tATStatsTeamId);

    const tATStatsCreatedAt: TATStatsCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const tATStatsUpdatedAt: TATStatsUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const teamAllTimeStats: TeamAllTimeStats = TeamAllTimeStats.create(
      tATStatsId.value,
      totalGamesPlayed,
      totalGamesWon,
      totalSeasonsLeaguePlayed,
      totalSeasonsLeagueWon,
      totalPoints,
      totalOffensiveRebounds,
      totalDefensiveRebounds,
      totalAssists,
      totalSteals,
      totalBlocks,
      totalFouls,
      totalTurnovers,
      totalThreePointersAttempted,
      totalThreePointersMade,
      totalFreeThrowsAttempted,
      totalFreeThrowsMade,
      totalFieldGoalsAttempted,
      totalFieldGoalsMade,
      tATStatsTeamId.value,
      tATStatsCreatedAt.value,
      tATStatsUpdatedAt.value,
    );

    return this.#teamAllTimeStatsRepository.save(teamAllTimeStats);
  }
}
