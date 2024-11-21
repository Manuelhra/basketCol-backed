import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  ITeamPlayerRepository,
  PlayerUserId,
  PlayerUserValidationDomainService,
  TeamId,
  TeamPlayer,
  TeamPlayerId,
  TeamPlayerStatus,
  TeamPlayerValidationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';
import { CreateTeamPlayerDTO } from '../dtos/CreateTeamPlayerDTO';
import { ICreateTeamPlayerUseCase } from './ports/ICreateTeamPlayerUseCase';

type Dependencies = {
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly teamPlayerValidationDomainService: TeamPlayerValidationDomainService;
  readonly teamPlayerRepository: ITeamPlayerRepository;
  readonly teamValidationDomainService: TeamValidationDomainService;
  readonly playerValidationDomainService: PlayerUserValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
};

export class CreateTeamPlayerUseCase implements ICreateTeamPlayerUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): CreateTeamPlayerUseCase {
    return new CreateTeamPlayerUseCase(dependencies);
  }

  public async execute(dto: CreateTeamPlayerDTO, userContext: IUserContext): Promise<void> {
    this.#validateUserAccess(userContext);
    const teamPlayer: TeamPlayer = await this.#createTeamPlayer(dto);
    return this.dependencies.teamPlayerRepository.save(teamPlayer);
  }

  async #createTeamPlayer(dto: CreateTeamPlayerDTO): Promise<TeamPlayer> {
    const {
      id,
      teamId,
      playerUserId,
      jerseyNumber,
      position,
    } = dto;

    const teamPlayerId: TeamPlayerId = TeamPlayerId.create(id);
    const newTeamId: TeamId = TeamId.create(teamId);
    const newPlayerUserId: PlayerUserId = PlayerUserId.create(playerUserId);

    await this.#validateTeamPlayerCreation(teamPlayerId, newTeamId, newPlayerUserId);

    const joinedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const createdAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const updatedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const status = TeamPlayerStatus.createActive();

    return TeamPlayer.create(
      id,
      newTeamId.value,
      newPlayerUserId.value,
      status.value,
      jerseyNumber,
      position,
      joinedAt.value,
      null,
      createdAt.value,
      updatedAt.value,
    );
  }

  async #validateTeamPlayerCreation(
    id: TeamPlayerId,
    teamId: TeamId,
    playerUserId: PlayerUserId,
  ): Promise<void> {
    await this.dependencies.idUniquenessValidatorDomainService.ensureUniqueId(id);
    await this.dependencies.teamValidationDomainService.ensureTeamExists(teamId);
    await this.dependencies.playerValidationDomainService.ensurePlayerUserExists(playerUserId);
    await this.dependencies.teamPlayerValidationDomainService.ensurePlayerIsRegistered(playerUserId, teamId);
  }

  #validateUserAccess(userContext: IUserContext): void {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a team player');
    }
  }
}
