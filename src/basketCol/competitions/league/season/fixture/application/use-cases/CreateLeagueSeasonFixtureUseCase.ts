import {
  BusinessDateService,
  HostUserType,
  IdUniquenessValidatorService,
  ILeagueSeasonFixturePrimitives,
  ILeagueSeasonFixtureRepository,
  LeagueSeasonFixture,
  LeagueSeasonFixtureDateValidatorService,
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
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly idUniquenessValidatorService: IdUniquenessValidatorService;
  readonly leagueSeasonValidationService: LeagueSeasonValidationService;
  readonly leagueSeasonFixtureValidationService: LeagueSeasonFixtureValidationService;
  readonly businessDateService: BusinessDateService;
  readonly leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;
  readonly leagueSeasonFixtureDateValidatorService: LeagueSeasonFixtureDateValidatorService;
};

export class CreateLeagueSeasonFixtureUseCase implements ICreateLeagueSeasonFixtureUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #leagueSeasonValidationService: LeagueSeasonValidationService;

  readonly #leagueSeasonFixtureValidationService: LeagueSeasonFixtureValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;

  readonly #leagueSeasonFixtureDateValidatorService: LeagueSeasonFixtureDateValidatorService;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#leagueSeasonValidationService = dependencies.leagueSeasonValidationService;
    this.#leagueSeasonFixtureValidationService = dependencies.leagueSeasonFixtureValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#leagueSeasonFixtureRepository = dependencies.leagueSeasonFixtureRepository;
    this.#leagueSeasonFixtureDateValidatorService = dependencies.leagueSeasonFixtureDateValidatorService;
  }

  public static create(dependencies: Dependencies): CreateLeagueSeasonFixtureUseCase {
    return new CreateLeagueSeasonFixtureUseCase(dependencies);
  }

  public async execute(dto: CreateLeagueSeasonFixtureDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a league season fixture');
    }

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
    await this.#leagueSeasonFixtureDateValidatorService.ensureDateWithinLeagueSeason(lSFixtureLeagueSeasonId, lSFixtureDate);

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
