import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  IPlayerUserCareerStatsPrimitives,
  IPlayerUserCareerStatsRepository,
  PlayerUserCareerStats,
  PlayerUserValidationDomainService,
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
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly playerUserValidationDomainService: PlayerUserValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
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

    await this.dependencies.idUniquenessValidatorDomainService.ensureUniqueId<PUCStatsId, IPlayerUserCareerStatsPrimitives, PlayerUserCareerStats>(pUCStatsId);
    await this.dependencies.playerUserValidationDomainService.ensurePlayerUserExists(pUCStatsPlayerUserId);

    const pUCStatsCreatedAt: PUCStatsCreatedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const pUCStatsUpdatedAt: PUCStatsUpdatedAt = this.dependencies.businessDateDomainService.getCurrentDate();

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
      pUCStatsPlayerUserId.value,
      pUCStatsCreatedAt.value,
      pUCStatsUpdatedAt.value,
    );

    return this.dependencies.playerUserCareerStatsRepository.save(playerUserCareerStats);
  }
}
