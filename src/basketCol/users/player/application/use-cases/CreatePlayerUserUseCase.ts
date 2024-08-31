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
  PlayerUserPassword,
  PlayerUserUpdatedAt,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { CreatePlayerUserDTO } from '../dtos/CreatePlayerUserDTO';

export class CreatePlayerUserUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #securePasswordCreationService: SecurePasswordCreationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserRepository: IPlayerUserRepository;

  constructor(dependencies: {
    emailUniquenessValidatorService: EmailUniquenessValidatorService;
    idUniquenessValidatorService: IdUniquenessValidatorService;
    securePasswordCreationService: SecurePasswordCreationService;
    playerUserRepository: IPlayerUserRepository;
    businessDateService: BusinessDateService;
  }) {
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#businessDateService = dependencies.businessDateService;
  }

  public async run(payload: CreatePlayerUserDTO): Promise<void> {
    const {
      id,
      name,
      biography,
      email,
      password,
    } = payload;

    const playerUserId: PlayerUserId = new PlayerUserId(id);
    const playerUserEmail: PlayerUserEmail = new PlayerUserEmail({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<PlayerUserId, IPlayerUser, PlayerUser>(playerUserId);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<PlayerUserEmail, IPlayerUser, PlayerUser>(playerUserEmail);

    const active: boolean = true;
    const playerUserPassword: PlayerUserPassword = this.#securePasswordCreationService.createFromPlainText<PlayerUserPassword>(password);
    const playerUserCreatedAt: PlayerUserCreatedAt = this.#businessDateService.getCurrentDate();
    const playerUserUpdatedAt: PlayerUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUser: PlayerUser = new PlayerUser(
      playerUserId.value,
      name,
      biography,
      playerUserEmail.value,
      playerUserPassword.value,
      active,
      playerUserCreatedAt.value,
      playerUserUpdatedAt.value,
    );

    return this.#playerUserRepository.save(playerUser);
  }
}
