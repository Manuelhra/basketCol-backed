import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  ILeagueSeasonAwardsPrimitives,
  ILeagueSeasonAwardsRepository,
  LeagueSeasonAwards,
  LeagueSeasonAwardsId,
  LeagueSeasonValidationDomainService,
  LSABestAssistProviderId,
  LSABestDefensiveRebounderId,
  LSABestFreeThrowShooterId,
  LSABestOffensiveRebounderId,
  LSABestThreePointShooterId,
  LSABestTwoPointShooterId,
  LSAChampionTeamId,
  LSACreatedAt,
  LSALeagueSeasonId,
  LSAUpdatedAt,
  PlayerUserValidationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { CreateLeagueSeasonAwardsDTO } from '../dtos/CreateLeagueSeasonAwardsDTO';
import { ICreateLeagueSeasonAwardsUseCase } from './ports/ICreateLeagueSeasonAwardsUseCase';

type Dependencies = {
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  teamValidationDomainService: TeamValidationDomainService;
  leagueSeasonValidationDomainService: LeagueSeasonValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  leagueSeasonAwardsRepository: ILeagueSeasonAwardsRepository;
};

export class CreateLeagueSeasonAwardsUseCase implements ICreateLeagueSeasonAwardsUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #playerUserValidationDomainService: PlayerUserValidationDomainService;

  readonly #teamValidationDomainService: TeamValidationDomainService;

  readonly #leagueSeasonValidationDomainService: LeagueSeasonValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #leagueSeasonAwardsRepository: ILeagueSeasonAwardsRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#playerUserValidationDomainService = dependencies.playerUserValidationDomainService;
    this.#teamValidationDomainService = dependencies.teamValidationDomainService;
    this.#leagueSeasonValidationDomainService = dependencies.leagueSeasonValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#leagueSeasonAwardsRepository = dependencies.leagueSeasonAwardsRepository;
  }

  public static create(dependencies: Dependencies): CreateLeagueSeasonAwardsUseCase {
    return new CreateLeagueSeasonAwardsUseCase(dependencies);
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
    const lSALeagueSeasonId: LSALeagueSeasonId = LSALeagueSeasonId.create(leagueSeasonId);

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<LeagueSeasonAwardsId, ILeagueSeasonAwardsPrimitives, LeagueSeasonAwards>(leagueSeasonAwardsId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(lSABestThreePointShooterId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(lSABestTwoPointShooterId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(lSABestFreeThrowShooterId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(lSABestAssistProviderId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(lSABestOffensiveRebounderId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(lSABestDefensiveRebounderId);
    await this.#teamValidationDomainService.ensureTeamExists(lSAChampionTeamId);
    await this.#leagueSeasonValidationDomainService.ensureLeagueSeasonExists(lSALeagueSeasonId);

    const lSACreatedAt: LSACreatedAt = this.#businessDateDomainService.getCurrentDate();
    const lSAUpdatedAt: LSAUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const leagueSeasonAwards: LeagueSeasonAwards = LeagueSeasonAwards.create(
      leagueSeasonAwardsId.value,
      lSABestThreePointShooterId.value,
      lSABestTwoPointShooterId.value,
      lSABestFreeThrowShooterId.value,
      lSABestAssistProviderId.value,
      lSABestOffensiveRebounderId.value,
      lSABestDefensiveRebounderId.value,
      lSAChampionTeamId.value,
      lSALeagueSeasonId.value,
      lSACreatedAt.value,
      lSAUpdatedAt.value,
    );

    return this.#leagueSeasonAwardsRepository.save(leagueSeasonAwards);
  }
}
