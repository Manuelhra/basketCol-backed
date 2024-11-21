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
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  playerUserLeagueSeasonFixtureGameBoxScoreRepository: IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository;
};

export class CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase implements ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;

  readonly #playerUserValidationDomainService: PlayerUserValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #playerUserLeagueSeasonFixtureGameBoxScoreRepository: IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#leagueSeasonFixtureGameValidationDomainService = dependencies.leagueSeasonFixtureGameValidationDomainService;
    this.#playerUserValidationDomainService = dependencies.playerUserValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#playerUserLeagueSeasonFixtureGameBoxScoreRepository = dependencies.playerUserLeagueSeasonFixtureGameBoxScoreRepository;
  }

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

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<PLSFGBoxScoreId, IPlayerUserLeagueSeasonFixtureGameBoxScorePrimitives, PlayerUserLeagueSeasonFixtureGameBoxScore>(pLSFGBoxScoreId);
    await this.#leagueSeasonFixtureGameValidationDomainService.ensureLeagueSeasonFixtureGameExists(pLSFGBoxScoreFixtureGameId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(pLSFGBoxScorePlayerUserId);

    const pLSFGBoxScoreCreatedAt: PLSFGBoxScoreCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const pLSFGBoxScoreUpdatedAt: PLSFGBoxScoreUpdatedAt = this.#businessDateDomainService.getCurrentDate();

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

    return this.#playerUserLeagueSeasonFixtureGameBoxScoreRepository.save(playerUserLeagueSeasonFixtureGameBoxScore);
  }
}
