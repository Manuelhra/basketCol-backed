import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPlayerUserCareerStats,
  IPlayerUserCareerStatsRepository,
  PlayerUserCareerStats,
  PlayerUserValidationService,
  PUCStatsCreatedAt,
  PUCStatsId,
  PUCStatsPlayerUserId,
  PUCStatsUpdatedAt,
} from '@basketcol/domain';

import { CreatePlayerUserCareerStatsDTO } from '../dtos/CreatePlayerUserCareerStatsDTO';
import { ICreatePlayerUserCareerStatsUseCase } from './ports/ICreatePlayerUserCareerStatsUseCase';

export class CreatePlayerUserCareerStatsUseCase implements ICreatePlayerUserCareerStatsUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;

  public constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    playerUserValidationService: PlayerUserValidationService;
    businessDateService: BusinessDateService;
    playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserCareerStatsRepository = dependencies.playerUserCareerStatsRepository;
  }

  public async execute(dto: CreatePlayerUserCareerStatsDTO): Promise<void> {
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
      playerUserId,
    } = dto;

    const pUCStatsId: PUCStatsId = new PUCStatsId(id);
    const pUCStatsPlayerUserId: PUCStatsPlayerUserId = new PUCStatsPlayerUserId(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUCStatsId, IPlayerUserCareerStats, PlayerUserCareerStats>(pUCStatsId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUCStatsPlayerUserId.value);

    const pUCStatsCreatedAt: PUCStatsCreatedAt = this.#businessDateService.getCurrentDate();
    const pUCStatsUpdatedAt: PUCStatsUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserCareerStats: PlayerUserCareerStats = new PlayerUserCareerStats(
      pUCStatsId.value,
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
      pUCStatsPlayerUserId.playerUserIdAsString,
      pUCStatsCreatedAt.value,
      pUCStatsUpdatedAt.value,
    );

    return this.#playerUserCareerStatsRepository.save(playerUserCareerStats);
  }
}
