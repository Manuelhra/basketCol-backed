import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  IPlayerUser,
  IPlayerUserRepository,
  PlayerUser,
  PlayerUserCreatedAt,
  PlayerUserEmail,
  PlayerUserId,
  PlayerUserNickname,
  PlayerUserNicknameValidationService,
  PlayerUserPassword,
  PlayerUserUpdatedAt,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { CreatePlayerUserDTO } from '../dtos/CreatePlayerUserDTO';
import { ICreatePlayerUserUseCase } from './ports/ICreatePlayerUserUseCase';

export class CreatePlayerUserUseCase implements ICreatePlayerUserUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserNicknameValidationService: PlayerUserNicknameValidationService;

  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #securePasswordCreationService: SecurePasswordCreationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserRepository: IPlayerUserRepository;

  constructor(dependencies: {
    playerUserNicknameValidationService: PlayerUserNicknameValidationService;
    emailUniquenessValidatorService: EmailUniquenessValidatorService;
    idUniquenessValidatorService: IdUniquenessValidatorService;
    securePasswordCreationService: SecurePasswordCreationService;
    playerUserRepository: IPlayerUserRepository;
    businessDateService: BusinessDateService;
  }) {
    this.#playerUserNicknameValidationService = dependencies.playerUserNicknameValidationService;
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#businessDateService = dependencies.businessDateService;
  }

  public async execute(dto: CreatePlayerUserDTO): Promise<void> {
    const {
      id,
      name,
      biography,
      nickname,
      email,
      password,
    } = dto;

    const playerUserId: PlayerUserId = new PlayerUserId(id);
    const playerUserNickname: PlayerUserNickname = new PlayerUserNickname(nickname);
    const playerUserEmail: PlayerUserEmail = new PlayerUserEmail({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<PlayerUserId, IPlayerUser, PlayerUser>(playerUserId);
    await this.#playerUserNicknameValidationService.ensureNicknameIsUnique(playerUserNickname);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<PlayerUserEmail, IPlayerUser, PlayerUser>(playerUserEmail);

    const active: boolean = true;
    const playerUserPassword: PlayerUserPassword = this.#securePasswordCreationService.createFromPlainText<PlayerUserPassword>(password);
    const playerUserCreatedAt: PlayerUserCreatedAt = this.#businessDateService.getCurrentDate();
    const playerUserUpdatedAt: PlayerUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUser: PlayerUser = new PlayerUser(
      playerUserId.value,
      name,
      biography,
      nickname,
      playerUserEmail.value,
      playerUserPassword.value,
      active,
      playerUserCreatedAt.value,
      playerUserUpdatedAt.value,
    );

    return this.#playerUserRepository.save(playerUser);
  }
}
