import {
  BusinessDateService,
  IdUniquenessValidatorService,
  ILeagueSeasonFixture,
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

export class CreateLeagueSeasonFixtureUseCase implements ICreateLeagueSeasonFixtureUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #leagueSeasonValidationService: LeagueSeasonValidationService;

  readonly #leagueSeasonFixtureValidationService: LeagueSeasonFixtureValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    leagueSeasonValidationService: LeagueSeasonValidationService;
    leagueSeasonFixtureValidationService: LeagueSeasonFixtureValidationService;
    businessDateService: BusinessDateService;
    leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#leagueSeasonValidationService = dependencies.leagueSeasonValidationService;
    this.#leagueSeasonFixtureValidationService = dependencies.leagueSeasonFixtureValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#leagueSeasonFixtureRepository = dependencies.leagueSeasonFixtureRepository;
  }

  public async execute(dto: CreateLeagueSeasonFixtureDTO): Promise<void> {
    const {
      id,
      date,
      name,
      leagueSeasonId,
    } = dto;

    const lSFixtureId: LSFixtureId = new LSFixtureId(id);
    const lSFixtureDate: LSFixtureDate = new LSFixtureDate(date);
    const lSFixtureLeagueSeasonId: LSFixtureLeagueSeasonId = new LSFixtureLeagueSeasonId(leagueSeasonId);

    await this.#idUniquenessValidatorService.ensureUniqueId<LSFixtureId, ILeagueSeasonFixture, LeagueSeasonFixture>(lSFixtureId);
    await this.#leagueSeasonValidationService.ensureLeagueSeasonExists(lSFixtureLeagueSeasonId.value);
    await this.#leagueSeasonFixtureValidationService.ensureNoFixtureExistsForDateAndLeagueSeason(lSFixtureLeagueSeasonId, lSFixtureDate);

    const lSFixtureCreatedAt: LSFixtureCreatedAt = this.#businessDateService.getCurrentDate();
    const lSFixtureUpdatedAt: LSFixtureUpdatedAt = this.#businessDateService.getCurrentDate();

    const leagueSeasonFixture: LeagueSeasonFixture = new LeagueSeasonFixture(
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
