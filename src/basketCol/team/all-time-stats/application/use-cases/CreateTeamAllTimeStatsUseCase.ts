import {
  BusinessDateService,
  HostUserType,
  IdUniquenessValidatorService,
  ITeamAllTimeStatsPrimitives,
  ITeamAllTimeStatsRepository,
  TATStatsCreatedAt,
  TATStatsId,
  TATStatsTeamId,
  TATStatsUpdatedAt,
  TeamAllTimeStats,
  TeamValidationService,
} from '@basketcol/domain';

import { CreateTeamAllTimeStatsDTO } from '../dtos/CreateTeamAllTimeStatsDTO';
import { ICreateTeamAllTimeStatsUseCase } from './ports/ICreateTeamAllTimeStatsUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  teamValidationService: TeamValidationService;
  businessDateService: BusinessDateService;
  teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;
};

export class CreateTeamAllTimeStatsUseCase implements ICreateTeamAllTimeStatsUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #teamValidationService: TeamValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#teamValidationService = dependencies.teamValidationService;
    this.#businessDateService = dependencies.businessDateService;
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

    await this.#idUniquenessValidatorService.ensureUniqueId<TATStatsId, ITeamAllTimeStatsPrimitives, TeamAllTimeStats>(tATStatsId);
    await this.#teamValidationService.ensureTeamExists(tATStatsTeamId.value);

    const tATStatsCreatedAt: TATStatsCreatedAt = this.#businessDateService.getCurrentDate();
    const tATStatsUpdatedAt: TATStatsUpdatedAt = this.#businessDateService.getCurrentDate();

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
      tATStatsTeamId.teamIdAsString,
      tATStatsCreatedAt.value,
      tATStatsUpdatedAt.value,
    );

    return this.#teamAllTimeStatsRepository.save(teamAllTimeStats);
  }
}
