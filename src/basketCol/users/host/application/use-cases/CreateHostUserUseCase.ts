import {
  BusinessDateService,
  HostUser,
  HostUserCreatedAt,
  HostUserPassword,
  HostUserUpdatedAt,
  IHostUserRepository,
  MultipleHostUsersException,
  Nullable,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { CreateHostUserDTO } from '../dtos/CreateHostUserDTO';

export class CreateHostUserUseCase {
  readonly #hostUserRepository: IHostUserRepository;

  readonly #securePasswordCreationService: SecurePasswordCreationService;

  readonly #businessDateService: BusinessDateService;

  constructor(dependencies: {
    hostUserRepository: IHostUserRepository;
    securePasswordCreationService: SecurePasswordCreationService;
    businessDateService: BusinessDateService;
  }) {
    this.#hostUserRepository = dependencies.hostUserRepository;
    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
    this.#businessDateService = dependencies.businessDateService;
  }

  public async execute(payload: CreateHostUserDTO): Promise<void> {
    const hostUserFound: Nullable<HostUser> = await this.#hostUserRepository.search();

    if (hostUserFound) {
      throw new MultipleHostUsersException();
    }

    const {
      id,
      name,
      biography,
      email,
      password,
    } = payload;

    const active: boolean = true;
    const hostUserPassword: HostUserPassword = this.#securePasswordCreationService.createFromPlainText<HostUserPassword>(password);
    const hostUserCreatedAt: HostUserCreatedAt = this.#businessDateService.getCurrentDate();
    const hostUserUpdatedAt: HostUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const hostUser: HostUser = new HostUser(
      id,
      name,
      biography,
      { value: email.value, verified: false },
      hostUserPassword.value,
      active,
      hostUserCreatedAt.value,
      hostUserUpdatedAt.value,
    );

    return this.#hostUserRepository.save(hostUser);
  }
}
