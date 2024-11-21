import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  ILeagueTeamRepository,
  LeagueId,
  LeagueTeam,
  LeagueTeamId,
  LeagueTeamStatus,
  LeagueTeamValidationDomainService,
  LeagueValidationDomainService,
  TeamId,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IUserContext } from '../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../shared/application/exceptions/UnauthorizedAccessError';
import { CreateLeagueTeamDTO } from '../dtos/CreateLeagueTeamDTO';
import { ICreateLeagueTeamUseCase } from './ports/ICreateLeagueTeamUseCase';

type Dependencies = {
  readonly leagueValidationDomainService: LeagueValidationDomainService;
  readonly teamValidationDomainService: TeamValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly leagueTeamRepository: ILeagueTeamRepository;
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly leagueTeamValidationDomainService: LeagueTeamValidationDomainService;
};

export class CreateLeagueTeamUseCase implements ICreateLeagueTeamUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): CreateLeagueTeamUseCase {
    return new CreateLeagueTeamUseCase(dependencies);
  }

  public async execute(dto: CreateLeagueTeamDTO, userContext: IUserContext): Promise<void> {
    this.#validateUserAccess(userContext);
    const leagueTeam: LeagueTeam = await this.#createLeagueTeam(dto);
    return this.dependencies.leagueTeamRepository.save(leagueTeam);
  }

  async #createLeagueTeam(dto: CreateLeagueTeamDTO): Promise<LeagueTeam> {
    const {
      id,
      leagueId,
      teamId,
    } = dto;

    const leagueTeamId: LeagueTeamId = LeagueTeamId.create(id);
    const newLeagueId: LeagueId = LeagueId.create(leagueId);
    const newTeamId: TeamId = TeamId.create(teamId);

    await this.#validateLeagueTeamCreation(leagueTeamId, newLeagueId, newTeamId);

    const joinedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const createdAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const updatedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const status = LeagueTeamStatus.createActive();

    return LeagueTeam.create(
      leagueTeamId.value,
      newTeamId.value,
      newLeagueId.value,
      status.value,
      joinedAt.value,
      null,
      null,
      null,
      null,
      createdAt.value,
      updatedAt.value,
    );
  }

  async #validateLeagueTeamCreation(
    leagueTeamId: LeagueTeamId,
    leagueId: LeagueId,
    teamId: TeamId,
  ): Promise<void> {
    await this.dependencies.idUniquenessValidatorDomainService.ensureUniqueId(leagueTeamId);
    await this.dependencies.leagueTeamValidationDomainService.ensureTeamIsRegistered(leagueId, teamId);
    await this.dependencies.leagueValidationDomainService.ensureLeagueExists(leagueId);
    await this.dependencies.teamValidationDomainService.ensureTeamExists(teamId);
  }

  #validateUserAccess(userContext: IUserContext): void {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a league team');
    }
  }
}
