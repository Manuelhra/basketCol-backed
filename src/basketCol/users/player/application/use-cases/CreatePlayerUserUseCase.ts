import {
  BusinessDateDomainService,
  EmailUniquenessValidatorDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  IPlayerUserPrimitives,
  IPlayerUserRepository,
  PlayerUser,
  PlayerUserCreatedAt,
  PlayerUserEmail,
  PlayerUserId,
  PlayerUserNickname,
  PlayerUserUpdatedAt,
  PlayerUserValidationDomainService,
  UserAccountState,
  UserSubscriptionType,
} from '@basketcol/domain';

import { CreatePlayerUserDTO } from '../dtos/CreatePlayerUserDTO';
import { ICreatePlayerUserUseCase } from './ports/ICreatePlayerUserUseCase';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { ICreatePlayerUserCareerStatsUseCase } from '../../career-stats/application/use-cases/ports/ICreatePlayerUserCareerStatsUseCase';
import { CreatePlayerUserCareerStatsDTO } from '../../career-stats/application/dtos/CreatePlayerUserCareerStatsDTO';
import { IUuidGenerator } from '../../../../shared/application/uuid/ports/IUuidGenerator';

type Dependencies = {
  readonly playerUserValidationDomainService: PlayerUserValidationDomainService;
  readonly emailUniquenessValidatorDomainService: EmailUniquenessValidatorDomainService;
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly playerUserRepository: IPlayerUserRepository;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly createPlayerUserCareerStatsUseCase: ICreatePlayerUserCareerStatsUseCase;
  readonly uuidGenerator: IUuidGenerator;
};

export class CreatePlayerUserUseCase implements ICreatePlayerUserUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): CreatePlayerUserUseCase {
    return new CreatePlayerUserUseCase(dependencies);
  }

  public async execute(dto: CreatePlayerUserDTO, userContext: IUserContext): Promise<void> {
    this.#validateUserAccess(userContext);
    const playerUser: PlayerUser = await this.#createPlayerUser(dto);
    await this.#savePlayerUser(playerUser);
    return this.#createPlayerUserCareerStats(playerUser.toPrimitives.id, userContext);
  }

  #validateUserAccess(userContext: IUserContext): void {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a team');
    }
  }

  async #createPlayerUser(dto: CreatePlayerUserDTO): Promise<PlayerUser> {
    const {
      id,
      name,
      biography,
      gender,
      nickname,
      email,
      password,
      profileImage,
    } = dto;

    const playerUserId: PlayerUserId = PlayerUserId.create(id);
    const playerUserNickname: PlayerUserNickname = PlayerUserNickname.create(nickname);
    const playerUserEmail: PlayerUserEmail = PlayerUserEmail.create({ value: email.value, verified: false });

    await this.#validatePlayerUserCreation(playerUserId, playerUserNickname, playerUserEmail);

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.free;
    const playerUserCreatedAt: PlayerUserCreatedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const playerUserUpdatedAt: PlayerUserUpdatedAt = this.dependencies.businessDateDomainService.getCurrentDate();

    return PlayerUser.create(
      playerUserId.value,
      name,
      biography,
      nickname,
      playerUserEmail.value,
      password,
      gender,
      accountState,
      subscriptionType,
      profileImage,
      playerUserCreatedAt.value,
      playerUserUpdatedAt.value,
    );
  }

  async #savePlayerUser(playerUser: PlayerUser): Promise<void> {
    await this.dependencies.playerUserRepository.save(playerUser);
  }

  async #validatePlayerUserCreation(
    playerUserId: PlayerUserId,
    playerUserNickname: PlayerUserNickname,
    playerUserEmail: PlayerUserEmail,
  ): Promise<void> {
    await this.dependencies.idUniquenessValidatorDomainService.ensureUniqueId<PlayerUserId, IPlayerUserPrimitives, PlayerUser>(playerUserId);
    await this.dependencies.playerUserValidationDomainService.ensureNicknameIsUnique(playerUserNickname);
    await this.dependencies.emailUniquenessValidatorDomainService.ensureUniqueEmail<PlayerUserEmail, IPlayerUserPrimitives, PlayerUser>(playerUserEmail);
  }

  async #createPlayerUserCareerStats(playerUserId: string, userContext: IUserContext): Promise<void> {
    const dto: CreatePlayerUserCareerStatsDTO = {
      id: this.dependencies.uuidGenerator.generate(),
      playerUserId,
      totalAssists: 0,
      totalBlocks: 0,
      totalDefensiveRebounds: 0,
      totalFieldGoalsAttempted: 0,
      totalFieldGoalsMade: 0,
      totalFouls: 0,
      totalFreeThrowsAttempted: 0,
      totalFreeThrowsMade: 0,
      totalGamesPlayed: 0,
      totalGamesWon: 0,
      totalOffensiveRebounds: 0,
      totalPoints: 0,
      totalSeasonsLeaguePlayed: 0,
      totalSeasonsLeagueWon: 0,
      totalSteals: 0,
      totalThreePointersAttempted: 0,
      totalThreePointersMade: 0,
      totalTurnovers: 0,
    };

    await this.dependencies.createPlayerUserCareerStatsUseCase.execute(dto, userContext);
  }
}
