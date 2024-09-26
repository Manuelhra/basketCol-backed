import {
  BusinessDateService,
  IdUniquenessValidatorService,
  ILeagueSeasonAwards,
  ILeagueSeasonAwardsRepository,
  LeagueSeasonAwards,
  LeagueSeasonAwardsId,
  LeagueSeasonValidationService,
  LSABestAssistProviderId,
  LSABestDefensiveRebounderId,
  LSABestFreeThrowShooterId,
  LSABestOffensiveRebounderId,
  LSABestThreePointShooterId,
  LSABestTwoPointShooterId,
  LSAChampionTeamId,
  LSACreatedAt,
  LSAReferencedLeagueSeasonId,
  LSAUpdatedAt,
  PlayerUserValidationService,
  TeamValidationService,
} from '@basketcol/domain';

import { CreateLeagueSeasonAwardsDTO } from '../dtos/CreateLeagueSeasonAwardsDTO';
import { ICreateLeagueSeasonAwardsUseCase } from './ports/ICreateLeagueSeasonAwardsUseCase';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  playerUserValidationService: PlayerUserValidationService;
  teamValidationService: TeamValidationService;
  leagueSeasonValidationService: LeagueSeasonValidationService;
  businessDateService: BusinessDateService;
  leagueSeasonAwardsRepository: ILeagueSeasonAwardsRepository;
};

export class CreateLeagueSeasonAwardsUseCase implements ICreateLeagueSeasonAwardsUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #teamValidationService: TeamValidationService;

  readonly #leagueSeasonValidationService: LeagueSeasonValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #leagueSeasonAwardsRepository: ILeagueSeasonAwardsRepository;

  constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#teamValidationService = dependencies.teamValidationService;
    this.#leagueSeasonValidationService = dependencies.leagueSeasonValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#leagueSeasonAwardsRepository = dependencies.leagueSeasonAwardsRepository;
  }

  public async execute(dto: CreateLeagueSeasonAwardsDTO): Promise<void> {
    const {
      id,
      bestThreePointShooterId,
      bestTwoPointShooterId,
      bestFreeThrowShooterId,
      bestAssistProviderId,
      bestOffensiveRebounderId,
      bestDefensiveRebounderId,
      championTeamId,
      leagueSeasonId,
    } = dto;

    const leagueSeasonAwardsId: LeagueSeasonAwardsId = LeagueSeasonAwardsId.create(id);
    const lSABestThreePointShooterId: LSABestThreePointShooterId = LSABestThreePointShooterId.create(bestThreePointShooterId);
    const lSABestTwoPointShooterId: LSABestTwoPointShooterId = LSABestTwoPointShooterId.create(bestTwoPointShooterId);
    const lSABestFreeThrowShooterId: LSABestFreeThrowShooterId = LSABestFreeThrowShooterId.create(bestFreeThrowShooterId);
    const lSABestAssistProviderId: LSABestAssistProviderId = LSABestAssistProviderId.create(bestAssistProviderId);
    const lSABestOffensiveRebounderId: LSABestOffensiveRebounderId = LSABestOffensiveRebounderId.create(bestOffensiveRebounderId);
    const lSABestDefensiveRebounderId: LSABestDefensiveRebounderId = LSABestDefensiveRebounderId.create(bestDefensiveRebounderId);
    const lSAChampionTeamId: LSAChampionTeamId = LSAChampionTeamId.create(championTeamId);
    const lSALeagueSeasonId: LSAReferencedLeagueSeasonId = LSAReferencedLeagueSeasonId.create(leagueSeasonId);

    await this.#idUniquenessValidatorService.ensureUniqueId<LeagueSeasonAwardsId, ILeagueSeasonAwards, LeagueSeasonAwards>(leagueSeasonAwardsId);
    await this.#playerUserValidationService.ensurePlayerUserExists(lSABestThreePointShooterId.value);
    await this.#playerUserValidationService.ensurePlayerUserExists(lSABestTwoPointShooterId.value);
    await this.#playerUserValidationService.ensurePlayerUserExists(lSABestFreeThrowShooterId.value);
    await this.#playerUserValidationService.ensurePlayerUserExists(lSABestAssistProviderId.value);
    await this.#playerUserValidationService.ensurePlayerUserExists(lSABestOffensiveRebounderId.value);
    await this.#playerUserValidationService.ensurePlayerUserExists(lSABestDefensiveRebounderId.value);
    await this.#teamValidationService.ensureTeamExists(lSAChampionTeamId.value);
    await this.#leagueSeasonValidationService.ensureLeagueSeasonExists(lSALeagueSeasonId.value);

    const lSACreatedAt: LSACreatedAt = this.#businessDateService.getCurrentDate();
    const lSAUpdatedAt: LSAUpdatedAt = this.#businessDateService.getCurrentDate();

    const leagueSeasonAwards: LeagueSeasonAwards = LeagueSeasonAwards.create(
      leagueSeasonAwardsId.value,
      lSABestThreePointShooterId.playerUserIdAsString,
      lSABestTwoPointShooterId.playerUserIdAsString,
      lSABestFreeThrowShooterId.playerUserIdAsString,
      lSABestAssistProviderId.playerUserIdAsString,
      lSABestOffensiveRebounderId.playerUserIdAsString,
      lSABestDefensiveRebounderId.playerUserIdAsString,
      lSAChampionTeamId.teamIdAsString,
      lSALeagueSeasonId.leagueSeasonIdAsString,
      lSACreatedAt.value,
      lSAUpdatedAt.value,
    );

    return this.#leagueSeasonAwardsRepository.save(leagueSeasonAwards);
  }
}
