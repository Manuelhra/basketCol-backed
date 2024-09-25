import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  HostUserType,
  IdUniquenessValidatorService,
  IPlayerUser,
  IPlayerUserRepository,
  PlayerUser,
  PlayerUserCreatedAt,
  PlayerUserEmail,
  PlayerUserId,
  PlayerUserNickname,
  PlayerUserNicknameValidationService,
  PlayerUserUpdatedAt,
  UserAccountState,
  UserSubscriptionType,
} from '@basketcol/domain';

import { CreatePlayerUserDTO } from '../dtos/CreatePlayerUserDTO';
import { ICreatePlayerUserUseCase } from './ports/ICreatePlayerUserUseCase';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';
import { IUserContext } from '../../../../shared/application/context/IUserContext';

export class CreatePlayerUserUseCase implements ICreatePlayerUserUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserNicknameValidationService: PlayerUserNicknameValidationService;

  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserRepository: IPlayerUserRepository;

  constructor(dependencies: {
    playerUserNicknameValidationService: PlayerUserNicknameValidationService;
    emailUniquenessValidatorService: EmailUniquenessValidatorService;
    idUniquenessValidatorService: IdUniquenessValidatorService;
    playerUserRepository: IPlayerUserRepository;
    businessDateService: BusinessDateService;
  }) {
    this.#playerUserNicknameValidationService = dependencies.playerUserNicknameValidationService;
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#businessDateService = dependencies.businessDateService;
  }

  public async execute(dto: CreatePlayerUserDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw new UnauthorizedAccessError(userContext, HostUserType.value, 'create a player user');
    }

    const {
      id,
      name,
      biography,
      nickname,
      email,
      password,
    } = dto;

    const playerUserId: PlayerUserId = PlayerUserId.create(id);
    const playerUserNickname: PlayerUserNickname = PlayerUserNickname.create(nickname);
    const playerUserEmail: PlayerUserEmail = PlayerUserEmail.create({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<PlayerUserId, IPlayerUser, PlayerUser>(playerUserId);
    await this.#playerUserNicknameValidationService.ensureNicknameIsUnique(playerUserNickname);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<PlayerUserEmail, IPlayerUser, PlayerUser>(playerUserEmail);

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.free;
    const playerUserCreatedAt: PlayerUserCreatedAt = this.#businessDateService.getCurrentDate();
    const playerUserUpdatedAt: PlayerUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUser: PlayerUser = PlayerUser.create(
      playerUserId.value,
      name,
      biography,
      nickname,
      playerUserEmail.value,
      password,
      accountState,
      subscriptionType,
      playerUserCreatedAt.value,
      playerUserUpdatedAt.value,
    );

    return this.#playerUserRepository.save(playerUser);
  }
}
