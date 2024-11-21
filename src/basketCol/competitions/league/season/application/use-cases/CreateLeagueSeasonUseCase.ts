import {
  BusinessDateDomainService,
  CourtValidationDomainService,
  EmptyCourtIdListError,
  IdUniquenessValidatorDomainService,
  ILeagueSeasonPrimitives,
  ILeagueSeasonRepository,
  LeagueId,
  LeagueSeason,
  LeagueSeasonCreatedAt,
  LeagueSeasonId,
  LeagueSeasonStatus,
  LeagueSeasonUpdatedAt,
  LeagueValidationDomainService,
  LeagueSeasonCourtIdList,
} from '@basketcol/domain';

import { CreateLeagueSeasonDTO } from '../dtos/CreateLeagueSeasonDTO';
import { ICreateLeagueSeasonUseCase } from './ports/ICreateLeagueSeasonUseCase';

type Dependencies = {
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly leagueSeasonRepository: ILeagueSeasonRepository;
  readonly leagueValidationDomainService: LeagueValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly courtValidationDomainService: CourtValidationDomainService;
};

export class CreateLeagueSeasonUseCase implements ICreateLeagueSeasonUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

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
    const leagueSeasonCourtIdList: LeagueSeasonCourtIdList = LeagueSeasonCourtIdList.create(courtIdList);

    await this.dependencies.idUniquenessValidatorDomainService.ensureUniqueId<LeagueSeasonId, ILeagueSeasonPrimitives, LeagueSeason>(leagueSeasonId);
    await this.dependencies.leagueValidationDomainService.ensureLeagueExists(leagueId);
    await this.dependencies.courtValidationDomainService.ensureCourtsExists(leagueSeasonCourtIdList);

    const leagueSeasonCreatedAt: LeagueSeasonCreatedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const leagueSeasonUpdatedAt: LeagueSeasonUpdatedAt = this.dependencies.businessDateDomainService.getCurrentDate();

    const leagueSeason: LeagueSeason = LeagueSeason.create(
      leagueSeasonId.value,
      name,
      startDate,
      endDate,
      leagueSeasonStatus.value,
      leagueSeasonCourtIdList.value,
      leagueId.value,
      leagueSeasonCreatedAt.value,
      leagueSeasonUpdatedAt.value,
    );

    return this.dependencies.leagueSeasonRepository.save(leagueSeason);
  }
}
