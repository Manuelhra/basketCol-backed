import {
  BusinessDateService,
  HostUser,
  HostUserAccountState,
  HostUserCreatedAt,
  HostUserPassword,
  HostUserSubscriptionType,
  HostUserUpdatedAt,
  IHostUserRepository,
  Nullable,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { CreateHostUserDTO } from '../dtos/CreateHostUserDTO';
import { ICreateHostUserUseCase } from './ports/ICreateHostUserUseCase';
import { MultipleHostUsersException } from '../exceptions/MultipleHostUsersException';

export class CreateHostUserUseCase implements ICreateHostUserUseCase {
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

  public async execute(dto: CreateHostUserDTO): Promise<void> {
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
    } = dto;

    const accountState: string = HostUserAccountState.active;
    const subscriptionType: string = HostUserSubscriptionType.free;
    const hostUserPassword: HostUserPassword = this.#securePasswordCreationService.createFromPlainText<HostUserPassword>(password);
    const hostUserCreatedAt: HostUserCreatedAt = this.#businessDateService.getCurrentDate();
    const hostUserUpdatedAt: HostUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const hostUser: HostUser = HostUser.create(
      id,
      name,
      biography,
      { value: email.value, verified: false },
      hostUserPassword.value,
      accountState,
      subscriptionType,
      hostUserCreatedAt.value,
      hostUserUpdatedAt.value,
    );

    return this.#hostUserRepository.save(hostUser);
  }
}
