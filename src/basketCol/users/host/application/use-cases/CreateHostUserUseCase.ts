import {
  BusinessDateService,
  HostUser,
  HostUserCreatedAt,
  HostUserUpdatedAt,
  IHostUserRepository,
  Nullable,
  SecurePasswordCreationService,
  UserAccountState,
  UserSubscriptionType,
} from '@basketcol/domain';

import { CreateHostUserDTO } from '../dtos/CreateHostUserDTO';
import { ICreateHostUserUseCase } from './ports/ICreateHostUserUseCase';
import { MultipleHostUsersException } from '../exceptions/MultipleHostUsersException';
import { InvalidHostUserCredentialsError } from '../exceptions/InvalidHostUserCredentialsError';
import { IHostUserConfigFactory } from '../ports/IHostUserConfigFactory';

export class CreateHostUserUseCase implements ICreateHostUserUseCase {
  readonly #hostUserConfigFactory: IHostUserConfigFactory;

  readonly #hostUserRepository: IHostUserRepository;

  readonly #businessDateService: BusinessDateService;

  constructor(dependencies: {
    hostUserConfigFactory: IHostUserConfigFactory;
    hostUserRepository: IHostUserRepository;
    securePasswordCreationService: SecurePasswordCreationService;
    businessDateService: BusinessDateService;
  }) {
    this.#hostUserConfigFactory = dependencies.hostUserConfigFactory;
    this.#hostUserRepository = dependencies.hostUserRepository;
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

    const hostUserCredentials = this.#hostUserConfigFactory.createHostUserCredentials();

    const isValidEmail: boolean = email.value === hostUserCredentials.email.value;
    const isValidPassword: boolean = password === hostUserCredentials.password;

    if (isValidEmail === false || isValidPassword === false) {
      throw new InvalidHostUserCredentialsError();
    }

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.premium;
    const hostUserCreatedAt: HostUserCreatedAt = this.#businessDateService.getCurrentDate();
    const hostUserUpdatedAt: HostUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const hostUser: HostUser = HostUser.create(
      id,
      name,
      biography,
      { value: email.value, verified: true },
      password,
      accountState,
      subscriptionType,
      hostUserCreatedAt.value,
      hostUserUpdatedAt.value,
    );

    return this.#hostUserRepository.save(hostUser);
  }
}
