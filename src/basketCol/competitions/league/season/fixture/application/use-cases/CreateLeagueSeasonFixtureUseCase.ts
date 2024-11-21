import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  ILeagueSeasonFixturePrimitives,
  ILeagueSeasonFixtureRepository,
  LeagueSeasonFixture,
  LeagueSeasonFixtureValidationDomainService,
  LeagueSeasonValidationDomainService,
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
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly leagueSeasonValidationDomainService: LeagueSeasonValidationDomainService;
  readonly leagueSeasonFixtureValidationDomainService: LeagueSeasonFixtureValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;
};

export class CreateLeagueSeasonFixtureUseCase implements ICreateLeagueSeasonFixtureUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #leagueSeasonValidationDomainService: LeagueSeasonValidationDomainService;

  readonly #leagueSeasonFixtureValidationDomainService: LeagueSeasonFixtureValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#leagueSeasonValidationDomainService = dependencies.leagueSeasonValidationDomainService;
    this.#leagueSeasonFixtureValidationDomainService = dependencies.leagueSeasonFixtureValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#leagueSeasonFixtureRepository = dependencies.leagueSeasonFixtureRepository;
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

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<LSFixtureId, ILeagueSeasonFixturePrimitives, LeagueSeasonFixture>(lSFixtureId);
    await this.#leagueSeasonValidationDomainService.ensureLeagueSeasonExists(lSFixtureLeagueSeasonId);
    await this.#leagueSeasonFixtureValidationDomainService.ensureNoFixtureExistsForDateAndLeagueSeason(lSFixtureLeagueSeasonId, lSFixtureDate);
    await this.#leagueSeasonFixtureValidationDomainService.ensureDateWithinLeagueSeason(lSFixtureLeagueSeasonId, lSFixtureDate);

    const lSFixtureCreatedAt: LSFixtureCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const lSFixtureUpdatedAt: LSFixtureUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const leagueSeasonFixture: LeagueSeasonFixture = LeagueSeasonFixture.create(
      lSFixtureId.value,
      lSFixtureDate.dateAsString,
      name,
      lSFixtureLeagueSeasonId.value,
      lSFixtureCreatedAt.value,
      lSFixtureUpdatedAt.value,
    );

    return this.#leagueSeasonFixtureRepository.save(leagueSeasonFixture);
  }
}
