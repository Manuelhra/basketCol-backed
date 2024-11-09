import {
  BusinessDateService,
  CourtValidationService,
  EmptyCourtIdListError,
  IdUniquenessValidatorService,
  ILeagueSeasonPrimitives,
  ILeagueSeasonRepository,
  LeagueId,
  LeagueSeason,
  LeagueSeasonCreatedAt,
  LeagueSeasonId,
  LeagueSeasonStatus,
  LeagueSeasonUpdatedAt,
  LeagueValidationService,
  LSReferencedCourtIdList,
} from '@basketcol/domain';

import { CreateLeagueSeasonDTO } from '../dtos/CreateLeagueSeasonDTO';
import { ICreateLeagueSeasonUseCase } from './ports/ICreateLeagueSeasonUseCase';

type Dependencies = {
  readonly idUniquenessValidatorService: IdUniquenessValidatorService;
  readonly leagueSeasonRepository: ILeagueSeasonRepository;
  readonly leagueValidationService: LeagueValidationService;
  readonly businessDateService: BusinessDateService;
  readonly courtValidationService: CourtValidationService;
};

export class CreateLeagueSeasonUseCase implements ICreateLeagueSeasonUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #leagueSeasonRepository: ILeagueSeasonRepository;

  readonly #leagueValidationService: LeagueValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #courtValidationService: CourtValidationService;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#leagueSeasonRepository = dependencies.leagueSeasonRepository;
    this.#leagueValidationService = dependencies.leagueValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#courtValidationService = dependencies.courtValidationService;
  }

  public static create(dependencies: Dependencies): CreateLeagueSeasonUseCase {
    return new CreateLeagueSeasonUseCase(dependencies);
  }

  public async execute(dto: CreateLeagueSeasonDTO): Promise<void> {
    const {
      id,
      name,
      startDate,
      endDate,
      courtIdList,
    } = dto;

    if (courtIdList.length === 0) {
      throw EmptyCourtIdListError.create();
    }

    const leagueSeasonId: LeagueSeasonId = LeagueSeasonId.create(id);
    const leagueSeasonStatus: LeagueSeasonStatus = LeagueSeasonStatus.createUpcoming();
    const leagueId: LeagueId = LeagueId.create(dto.leagueId);
    const leagueSeasonCourtIdList: LSReferencedCourtIdList = LSReferencedCourtIdList.create(courtIdList);

    await this.#idUniquenessValidatorService.ensureUniqueId<LeagueSeasonId, ILeagueSeasonPrimitives, LeagueSeason>(leagueSeasonId);
    await this.#leagueValidationService.ensureLeagueExist(leagueId);
    await this.#courtValidationService.ensureCourtsExist(leagueSeasonCourtIdList);

    const leagueSeasonCreatedAt: LeagueSeasonCreatedAt = this.#businessDateService.getCurrentDate();
    const leagueSeasonUpdatedAt: LeagueSeasonUpdatedAt = this.#businessDateService.getCurrentDate();

    const leagueSeason: LeagueSeason = LeagueSeason.create(
      leagueSeasonId.value,
      name,
      startDate,
      endDate,
      leagueSeasonStatus.value,
      leagueSeasonCourtIdList.courtIdListAsStrings,
      leagueId.value,
      leagueSeasonCreatedAt.value,
      leagueSeasonUpdatedAt.value,
    );

    return this.#leagueSeasonRepository.save(leagueSeason);
  }
}
