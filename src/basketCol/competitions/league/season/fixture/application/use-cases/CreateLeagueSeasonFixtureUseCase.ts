import {
  BusinessDateService,
  IdUniquenessValidatorService,
  ILeagueSeasonFixturePrimitives,
  ILeagueSeasonFixtureRepository,
  LeagueSeasonFixture,
  LeagueSeasonFixtureValidationService,
  LeagueSeasonValidationService,
  LSFixtureCreatedAt,
  LSFixtureDate,
  LSFixtureId,
  LSFixtureLeagueSeasonId,
  LSFixtureUpdatedAt,
} from '@basketcol/domain';

import { CreateLeagueSeasonFixtureDTO } from '../dtos/CreateLeagueSeasonFixtureDTO';
import { ICreateLeagueSeasonFixtureUseCase } from './ports/ICreateLeagueSeasonFixtureUseCase';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  leagueSeasonValidationService: LeagueSeasonValidationService;
  leagueSeasonFixtureValidationService: LeagueSeasonFixtureValidationService;
  businessDateService: BusinessDateService;
  leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;
};

export class CreateLeagueSeasonFixtureUseCase implements ICreateLeagueSeasonFixtureUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #leagueSeasonValidationService: LeagueSeasonValidationService;

  readonly #leagueSeasonFixtureValidationService: LeagueSeasonFixtureValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#leagueSeasonValidationService = dependencies.leagueSeasonValidationService;
    this.#leagueSeasonFixtureValidationService = dependencies.leagueSeasonFixtureValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#leagueSeasonFixtureRepository = dependencies.leagueSeasonFixtureRepository;
  }

  public static create(dependencies: Dependencies): CreateLeagueSeasonFixtureUseCase {
    return new CreateLeagueSeasonFixtureUseCase(dependencies);
  }

  public async execute(dto: CreateLeagueSeasonFixtureDTO): Promise<void> {
    const {
      id,
      date,
      name,
      leagueSeasonId,
    } = dto;

    const lSFixtureId: LSFixtureId = LSFixtureId.create(id);
    const lSFixtureDate: LSFixtureDate = LSFixtureDate.create(date);
    const lSFixtureLeagueSeasonId: LSFixtureLeagueSeasonId = LSFixtureLeagueSeasonId.create(leagueSeasonId);

    await this.#idUniquenessValidatorService.ensureUniqueId<LSFixtureId, ILeagueSeasonFixturePrimitives, LeagueSeasonFixture>(lSFixtureId);
    await this.#leagueSeasonValidationService.ensureLeagueSeasonExists(lSFixtureLeagueSeasonId.value);
    await this.#leagueSeasonFixtureValidationService.ensureNoFixtureExistsForDateAndLeagueSeason(lSFixtureLeagueSeasonId, lSFixtureDate);

    const lSFixtureCreatedAt: LSFixtureCreatedAt = this.#businessDateService.getCurrentDate();
    const lSFixtureUpdatedAt: LSFixtureUpdatedAt = this.#businessDateService.getCurrentDate();

    const leagueSeasonFixture: LeagueSeasonFixture = LeagueSeasonFixture.create(
      lSFixtureId.value,
      lSFixtureDate.dateAsString,
      name,
      lSFixtureLeagueSeasonId.leagueSeasonIdAsString,
      lSFixtureCreatedAt.value,
      lSFixtureUpdatedAt.value,
    );

    return this.#leagueSeasonFixtureRepository.save(leagueSeasonFixture);
  }
}
