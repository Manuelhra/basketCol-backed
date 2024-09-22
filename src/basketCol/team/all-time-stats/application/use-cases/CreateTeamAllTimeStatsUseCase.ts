import {
  BusinessDateService,
  IdUniquenessValidatorService,
  ITeamAllTimeStats,
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

export class CreateTeamAllTimeStatsUseCase implements ICreateTeamAllTimeStatsUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #teamValidationService: TeamValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;

  public constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    teamValidationService: TeamValidationService;
    businessDateService: BusinessDateService;
    teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#teamValidationService = dependencies.teamValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#teamAllTimeStatsRepository = dependencies.teamAllTimeStatsRepository;
  }

  public async execute(dto: CreateTeamAllTimeStatsDTO): Promise<void> {
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

    await this.#idUniquenessValidatorService.ensureUniqueId<TATStatsId, ITeamAllTimeStats, TeamAllTimeStats>(tATStatsId);
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
