import {
  BusinessDateDomainService,
  DateValueObject,
  HostUserType,
  IdUniquenessValidatorDomainService,
  ILeaguePrimitives,
  ILeagueRepository,
  League,
  LeagueCreatedAt,
  LeagueEstablishmentDate,
  LeagueFounderUserValidationDomainService,
  LeagueId,
  LeagueName,
  LeagueUpdatedAt,
  LeagueLeagueFounderUserId,
  LeagueValidationDomainService,
} from '@basketcol/domain';

import { CreateLeagueDTO } from '../dtos/CreateLeagueDTO';
import { ICreateLeagueUseCase } from './ports/ICreateLeagueUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly leagueRepository: ILeagueRepository;
  readonly leagueFounderUserValidationDomainService: LeagueFounderUserValidationDomainService;
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly leagueValidationDomainService: LeagueValidationDomainService;
};

export class CreateLeagueUseCase implements ICreateLeagueUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): CreateLeagueUseCase {
    return new CreateLeagueUseCase(dependencies);
  }

  public async execute(dto: CreateLeagueDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a league');
    }

    const {
      id,
      name,
      description,
      gender,
      level,
      rules,
      location,
      establishmentDate,
      leagueFounderUserId,
    } = dto;

    const leagueId: LeagueId = LeagueId.create(id);
    const leagueName: LeagueName = LeagueName.create(name);
    const leagueLeagueFounderUserId: LeagueLeagueFounderUserId = LeagueLeagueFounderUserId.create(leagueFounderUserId);
    const leagueEstablishmentDate: LeagueEstablishmentDate = LeagueEstablishmentDate.create(establishmentDate);
    const currentDate: DateValueObject = this.dependencies.businessDateDomainService.getCurrentDate();

    await this.dependencies.idUniquenessValidatorDomainService.ensureUniqueId<LeagueId, ILeaguePrimitives, League>(leagueId);
    await this.dependencies.leagueValidationDomainService.validateUniqueShortName(leagueName);
    await this.dependencies.leagueValidationDomainService.validateUniqueOfficialName(leagueName);

    await this.dependencies.leagueFounderUserValidationDomainService.ensureFounderUserExists(leagueLeagueFounderUserId);
    this.dependencies.businessDateDomainService.ensureNotGreaterThan<LeagueEstablishmentDate, DateValueObject>(leagueEstablishmentDate, currentDate);

    const isActive: boolean = true;
    const leagueCreatedAt: LeagueCreatedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const leagueUpdatedAt: LeagueUpdatedAt = this.dependencies.businessDateDomainService.getCurrentDate();

    const league: League = League.create(
      leagueId.value,
      name,
      description,
      gender,
      rules,
      level,
      location,
      leagueLeagueFounderUserId.value,
      leagueEstablishmentDate.value,
      isActive,
      leagueCreatedAt.value,
      leagueUpdatedAt.value,
    );

    return this.dependencies.leagueRepository.save(league);
  }
}
