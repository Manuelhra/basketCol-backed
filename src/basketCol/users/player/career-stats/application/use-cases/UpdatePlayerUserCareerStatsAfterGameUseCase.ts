import {
  BusinessDateDomainService,
  HostUserType,
  IPlayerUserCareerStatsRepository,
  ITeamPlayerRepository,
  ITeamRepository,
  PlayerUserNotFoundError,
  PlayerUserValidationDomainService,
  PUCStatsPlayerUserId,
  PUCStatsUpdatedAt,
} from '@basketcol/domain';

import { IUpdatePlayerUserCareerStatsAfterGameUseCase } from './ports/IUpdatePlayerUserCareerStatsAfterGameUseCase';
import { IUserContext } from '../../../../../shared/application/context/ports/IUserContext';
import { UpdatePlayerUserCareerStatsAfterGameDTO } from '../dtos/UpdatePlayerUserCareerStatsAfterGameDTO';
import { UnauthorizedAccessError } from '../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly playerUserValidationDomainService: PlayerUserValidationDomainService;
  readonly teamRepository: ITeamRepository;
  readonly playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
  readonly teamPlayerRepository: ITeamPlayerRepository;
  readonly businessDateDomainService: BusinessDateDomainService;
};

export class UpdatePlayerUserCareerStatsAfterGameUseCase implements IUpdatePlayerUserCareerStatsAfterGameUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public async execute(dto: UpdatePlayerUserCareerStatsAfterGameDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'update player user career stats');
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
      playerUserId,
    } = dto;

    const pUCStatsPlayerUserId: PUCStatsPlayerUserId = PUCStatsPlayerUserId.create(playerUserId);
    const pUCStatsUpdatedAt: PUCStatsUpdatedAt = this.dependencies.businessDateDomainService.getCurrentDate();

    const playerUserCareerStats = await this.dependencies.playerUserCareerStatsRepository.findByPlayerUserId(pUCStatsPlayerUserId);

    if (playerUserCareerStats === null || playerUserCareerStats === undefined) {
      throw PlayerUserNotFoundError.create(pUCStatsPlayerUserId);
    }

    const updatedPlayerUserCareerStats = playerUserCareerStats.incrementStatsAfterGame(
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
      pUCStatsUpdatedAt.value,
    );

    return this.dependencies.playerUserCareerStatsRepository.update(updatedPlayerUserCareerStats);
  }
}
