import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  IPlayerUserLeagueSeasonFixtureGameBoxScorePrimitives,
  IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository,
  LeagueSeasonFixtureGameValidationDomainService,
  PlayerUserLeagueSeasonFixtureGameBoxScore,
  PlayerUserValidationDomainService,
  PLSFGBoxScoreCreatedAt,
  PLSFGBoxScoreFixtureGameId,
  PLSFGBoxScoreId,
  PLSFGBoxScorePlayerUserId,
  PLSFGBoxScoreUpdatedAt,
} from '@basketcol/domain';

import { CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO } from '../dtos/CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO';
import { ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase } from './ports/ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase';

type Dependencies = {
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;
  readonly playerUserValidationDomainService: PlayerUserValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly playerUserLeagueSeasonFixtureGameBoxScoreRepository: IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository;
};

export class CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase implements ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase {
    return new CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase(dependencies);
  }

  public async execute(dto: CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO): Promise<void> {
    const {
      id,
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
      fixtureGameId,
      playerUserId,
    } = dto;

    const pLSFGBoxScoreId: PLSFGBoxScoreId = PLSFGBoxScoreId.create(id);
    const pLSFGBoxScoreFixtureGameId: PLSFGBoxScoreFixtureGameId = PLSFGBoxScoreFixtureGameId.create(fixtureGameId);
    const pLSFGBoxScorePlayerUserId: PLSFGBoxScorePlayerUserId = PLSFGBoxScorePlayerUserId.create(playerUserId);

    await this.dependencies.idUniquenessValidatorDomainService.ensureUniqueId<PLSFGBoxScoreId, IPlayerUserLeagueSeasonFixtureGameBoxScorePrimitives, PlayerUserLeagueSeasonFixtureGameBoxScore>(pLSFGBoxScoreId);
    await this.dependencies.leagueSeasonFixtureGameValidationDomainService.ensureLeagueSeasonFixtureGameExists(pLSFGBoxScoreFixtureGameId);
    await this.dependencies.playerUserValidationDomainService.ensurePlayerUserExists(pLSFGBoxScorePlayerUserId);

    const pLSFGBoxScoreCreatedAt: PLSFGBoxScoreCreatedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const pLSFGBoxScoreUpdatedAt: PLSFGBoxScoreUpdatedAt = this.dependencies.businessDateDomainService.getCurrentDate();

    const playerUserLeagueSeasonFixtureGameBoxScore: PlayerUserLeagueSeasonFixtureGameBoxScore = PlayerUserLeagueSeasonFixtureGameBoxScore.create(
      pLSFGBoxScoreId.value,
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
      pLSFGBoxScoreFixtureGameId.value,
      pLSFGBoxScorePlayerUserId.value,
      pLSFGBoxScoreCreatedAt.value,
      pLSFGBoxScoreUpdatedAt.value,
    );

    return this.dependencies.playerUserLeagueSeasonFixtureGameBoxScoreRepository.save(playerUserLeagueSeasonFixtureGameBoxScore);
  }
}
