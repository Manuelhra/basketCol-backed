import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPlayerUserLeagueSeasonFixtureGameBoxScore,
  IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository,
  LeagueSeasonFixtureGameValidationService,
  PlayerUserLeagueSeasonFixtureGameBoxScore,
  PlayerUserValidationService,
  PLSFGBoxScoreCreatedAt,
  PLSFGBoxScoreFixtureGameId,
  PLSFGBoxScoreId,
  PLSFGBoxScorePlayerUserId,
  PLSFGBoxScoreUpdatedAt,
} from '@basketcol/domain';

import { CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO } from '../dtos/CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO';
import { ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase } from './ports/ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase';

export class CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase implements ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #leagueSeasonFixtureGameValidationService: LeagueSeasonFixtureGameValidationService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserLeagueSeasonFixtureGameBoxScoreRepository: IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    leagueSeasonFixtureGameValidationService: LeagueSeasonFixtureGameValidationService;
    playerUserValidationService: PlayerUserValidationService;
    businessDateService: BusinessDateService;
    playerUserLeagueSeasonFixtureGameBoxScoreRepository: IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#leagueSeasonFixtureGameValidationService = dependencies.leagueSeasonFixtureGameValidationService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserLeagueSeasonFixtureGameBoxScoreRepository = dependencies.playerUserLeagueSeasonFixtureGameBoxScoreRepository;
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

    await this.#idUniquenessValidatorService.ensureUniqueId<PLSFGBoxScoreId, IPlayerUserLeagueSeasonFixtureGameBoxScore, PlayerUserLeagueSeasonFixtureGameBoxScore>(pLSFGBoxScoreId);
    await this.#leagueSeasonFixtureGameValidationService.ensureLeagueSeasonFixtureGameExists(pLSFGBoxScoreFixtureGameId.value);
    await this.#playerUserValidationService.ensurePlayerUserExists(pLSFGBoxScorePlayerUserId.value);

    const pLSFGBoxScoreCreatedAt: PLSFGBoxScoreCreatedAt = this.#businessDateService.getCurrentDate();
    const pLSFGBoxScoreUpdatedAt: PLSFGBoxScoreUpdatedAt = this.#businessDateService.getCurrentDate();

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
      pLSFGBoxScoreFixtureGameId.fixtureGameIdAsString,
      pLSFGBoxScorePlayerUserId.playerUserIdAsString,
      pLSFGBoxScoreCreatedAt.value,
      pLSFGBoxScoreUpdatedAt.value,
    );

    return this.#playerUserLeagueSeasonFixtureGameBoxScoreRepository.save(playerUserLeagueSeasonFixtureGameBoxScore);
  }
}
