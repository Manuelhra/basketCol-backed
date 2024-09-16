import {
  BusinessDateService,
  CourtValidationService,
  IdUniquenessValidatorService,
  ILeagueSeason,
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

export class CreateLeagueSeasonUseCase implements ICreateLeagueSeasonUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #leagueSeasonRepository: ILeagueSeasonRepository;

  readonly #leagueValidationService: LeagueValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #courtValidationService: CourtValidationService;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    leagueSeasonRepository: ILeagueSeasonRepository;
    leagueValidationService: LeagueValidationService;
    businessDateService: BusinessDateService;
    courtValidationService: CourtValidationService;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#leagueSeasonRepository = dependencies.leagueSeasonRepository;
    this.#leagueValidationService = dependencies.leagueValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#courtValidationService = dependencies.courtValidationService;
  }

  public async execute(dto: CreateLeagueSeasonDTO): Promise<void> {
    const {
      id,
      name,
      startDate,
      endDate,
      courtIdList,
    } = dto;

    const leagueSeasonId: LeagueSeasonId = new LeagueSeasonId(id);
    const leagueSeasonStatus: LeagueSeasonStatus = LeagueSeasonStatus.createUpcoming();
    const leagueId: LeagueId = new LeagueId(dto.leagueId);
    const leagueSeasonCourtIdList: LSReferencedCourtIdList = new LSReferencedCourtIdList(courtIdList);

    await this.#idUniquenessValidatorService.ensureUniqueId<LeagueSeasonId, ILeagueSeason, LeagueSeason>(leagueSeasonId);
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
