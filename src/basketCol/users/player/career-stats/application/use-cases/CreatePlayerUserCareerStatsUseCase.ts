import {
  BusinessDateService,
  HostUserType,
  IdUniquenessValidatorService,
  IPlayerUserCareerStatsPrimitives,
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
import { IUserContext } from '../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly idUniquenessValidatorService: IdUniquenessValidatorService;
  readonly playerUserValidationService: PlayerUserValidationService;
  readonly businessDateService: BusinessDateService;
  readonly playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
};

export class CreatePlayerUserCareerStatsUseCase implements ICreatePlayerUserCareerStatsUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): CreatePlayerUserCareerStatsUseCase {
    return new CreatePlayerUserCareerStatsUseCase(dependencies);
  }

  public async execute(dto: CreatePlayerUserCareerStatsDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create player user career stats');
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
      playerUserId,
    } = dto;

    const pUCStatsId: PUCStatsId = PUCStatsId.create(id);
    const pUCStatsPlayerUserId: PUCStatsPlayerUserId = PUCStatsPlayerUserId.create(playerUserId);

    await this.dependencies.idUniquenessValidatorService.ensureUniqueId<PUCStatsId, IPlayerUserCareerStatsPrimitives, PlayerUserCareerStats>(pUCStatsId);
    await this.dependencies.playerUserValidationService.ensurePlayerUserExists(pUCStatsPlayerUserId.value);

    const pUCStatsCreatedAt: PUCStatsCreatedAt = this.dependencies.businessDateService.getCurrentDate();
    const pUCStatsUpdatedAt: PUCStatsUpdatedAt = this.dependencies.businessDateService.getCurrentDate();

    const playerUserCareerStats: PlayerUserCareerStats = PlayerUserCareerStats.create(
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

    return this.dependencies.playerUserCareerStatsRepository.save(playerUserCareerStats);
  }
}
