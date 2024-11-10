import {
  BusinessDateService,
  IdUniquenessValidatorService,
  ITeamPrimitives,
  ITeamRepository,
  Team,
  TeamId,
  TeamFounderUserValidationService,
  TReferencedTeamFounderUserId,
  HostUserType,
} from '@basketcol/domain';

import { CreateTeamDTO } from '../dtos/CreateTeamDTO';
import { ICreateTeamUseCase } from './ports/ICreateTeamUseCase';
import { ICreateTeamAllTimeStatsUseCase } from '../../all-time-stats/application/use-cases/ports/ICreateTeamAllTimeStatsUseCase';
import { IUuidGenerator } from '../../../shared/application/uuid/ports/IUuidGenerator';
import { IUserContext } from '../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../shared/application/exceptions/UnauthorizedAccessError';
import { CreateTeamAllTimeStatsDTO } from '../../all-time-stats/application/dtos/CreateTeamAllTimeStatsDTO';

interface Dependencies {
  readonly idUniquenessValidatorService: IdUniquenessValidatorService;
  readonly teamFounderUserValidationService: TeamFounderUserValidationService;
  readonly businessDateService: BusinessDateService;
  readonly teamRepository: ITeamRepository;
  readonly createTeamAllTimeStatsUseCase: ICreateTeamAllTimeStatsUseCase;
  readonly uuidGenerator: IUuidGenerator;
}

export class CreateTeamUseCase implements ICreateTeamUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): CreateTeamUseCase {
    return new CreateTeamUseCase(dependencies);
  }

  public async execute(dto: CreateTeamDTO, userContext: IUserContext): Promise<void> {
    this.#validateUserAccess(userContext);
    const team: Team = await this.#createTeam(dto);
    await this.#createTeamStats(team.toPrimitives.id, userContext);
    return this.dependencies.teamRepository.save(team);
  }

  #validateUserAccess(userContext: IUserContext): void {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a team');
    }
  }

  async #createTeam(dto: CreateTeamDTO): Promise<Team> {
    const { id, officialName, teamFounderUserId } = dto;

    const teamId = TeamId.create(id);
    const teamFounderId = TReferencedTeamFounderUserId.create(teamFounderUserId);

    await this.#validateTeamCreation(teamId, teamFounderId);

    const createdAt = this.dependencies.businessDateService.getCurrentDate();
    const updatedAt = this.dependencies.businessDateService.getCurrentDate();

    return Team.create(
      teamId.value,
      officialName,
      teamFounderId.teamFounderUserIdAsString,
      createdAt.value,
      updatedAt.value,
    );
  }

  async #validateTeamCreation(
    teamId: TeamId,
    teamFounderId: TReferencedTeamFounderUserId,
  ): Promise<void> {
    await this.dependencies.idUniquenessValidatorService
      .ensureUniqueId<TeamId, ITeamPrimitives, Team>(teamId);

    await this.dependencies.teamFounderUserValidationService
      .ensureTeamFounderUserExists(teamFounderId.value);
  }

  async #createTeamStats(teamId: string, userContext: IUserContext): Promise<void> {
    const dto: CreateTeamAllTimeStatsDTO = {
      id: this.dependencies.uuidGenerator.generate(),
      teamId,
      totalGamesPlayed: 0,
      totalGamesWon: 0,
      totalSeasonsLeaguePlayed: 0,
      totalSeasonsLeagueWon: 0,
      totalPoints: 0,
      totalOffensiveRebounds: 0,
      totalDefensiveRebounds: 0,
      totalAssists: 0,
      totalSteals: 0,
      totalBlocks: 0,
      totalFouls: 0,
      totalTurnovers: 0,
      totalThreePointersAttempted: 0,
      totalThreePointersMade: 0,
      totalFreeThrowsAttempted: 0,
      totalFreeThrowsMade: 0,
      totalFieldGoalsAttempted: 0,
      totalFieldGoalsMade: 0,
    };

    await this.dependencies.createTeamAllTimeStatsUseCase.execute(
      dto,
      userContext,
    );
  }
}
