import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  IPlayerUserLeagueSeasonFixtureGameBoxScorePrimitives,
  IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository,
  ITeamPlayerRepository,
  LeagueSeasonFixtureGameValidationDomainService,
  Nullable,
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
import { IUpdatePlayerUserCareerStatsAfterGameUseCase } from '../../../../../../../../../users/player/career-stats/application/use-cases/ports/IUpdatePlayerUserCareerStatsAfterGameUseCase';
import { NoActiveTeamPlayerFoundError } from '../exceptions/NoActiveTeamPlayerFoundError';
import { IUserContext } from '../../../../../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../../../../../shared/application/exceptions/UnauthorizedAccessError';
import { PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError } from '../exceptions/PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError';

type Dependencies = {
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;
  readonly playerUserValidationDomainService: PlayerUserValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly playerUserLeagueSeasonFixtureGameBoxScoreRepository: IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository;
  readonly updatePlayerUserCareerStatsAfterGameUseCase: IUpdatePlayerUserCareerStatsAfterGameUseCase;
  readonly teamPlayerRepository: ITeamPlayerRepository;
};

export class CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase implements ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase {
    return new CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase(dependencies);
  }

  public async execute(dto: CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create player user league season fixture game box score');
    }

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

    const playerUserLeagueSeasonFixtureGameBoxScoreFound: Nullable<PlayerUserLeagueSeasonFixtureGameBoxScore> = await this.dependencies.playerUserLeagueSeasonFixtureGameBoxScoreRepository.find();

    if (playerUserLeagueSeasonFixtureGameBoxScoreFound !== null) {
      throw PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError.create(playerUserId, fixtureGameId);
    }

    const pLSFGBoxScoreId: PLSFGBoxScoreId = PLSFGBoxScoreId.create(id);
    const pLSFGBoxScoreFixtureGameId: PLSFGBoxScoreFixtureGameId = PLSFGBoxScoreFixtureGameId.create(fixtureGameId);
    const pLSFGBoxScorePlayerUserId: PLSFGBoxScorePlayerUserId = PLSFGBoxScorePlayerUserId.create(playerUserId);

    await this.dependencies.idUniquenessValidatorDomainService.ensureUniqueId<PLSFGBoxScoreId, IPlayerUserLeagueSeasonFixtureGameBoxScorePrimitives, PlayerUserLeagueSeasonFixtureGameBoxScore>(pLSFGBoxScoreId);

    const fixtureGame = await this.dependencies.leagueSeasonFixtureGameValidationDomainService
      .ensureLeagueSeasonFixtureGameExists(pLSFGBoxScoreFixtureGameId);

    await this.dependencies.playerUserValidationDomainService.ensurePlayerUserExists(pLSFGBoxScorePlayerUserId);

    // Find the team player to get the team ID
    const teamPlayer = await this.dependencies.teamPlayerRepository
      .findTeamActivePlayerByPlayerUserId(pLSFGBoxScorePlayerUserId);

    if (teamPlayer === undefined || teamPlayer === null) {
      throw NoActiveTeamPlayerFoundError.create(playerUserId);
    }

    const hasWonGame = this.determineGameResult(
      teamPlayer.toPrimitives.teamId,
      fixtureGame.toPrimitives.homeTeamId,
      fixtureGame.toPrimitives.awayTeamId,
      fixtureGame.toPrimitives.homeScore,
      fixtureGame.toPrimitives.awayScore,
    );

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

    await this.dependencies.playerUserLeagueSeasonFixtureGameBoxScoreRepository.save(playerUserLeagueSeasonFixtureGameBoxScore);

    await this.dependencies.updatePlayerUserCareerStatsAfterGameUseCase.execute({
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
    }, userContext);
  }

  private determineGameResult(
    teamId: string,
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number,
  ): boolean {
    const isHomeTeam = homeTeamId === teamId;
    const isHomeTeamWinner = homeScore > awayScore;

    if (isHomeTeam === true) {
      return isHomeTeamWinner;
    }

    return isHomeTeamWinner === false;
  }
}
