import {
  BusinessDateDomainService,
  HostUser,
  HostUserCreatedAt,
  HostUserUpdatedAt,
  IHostUserRepository,
  Nullable,
  SecurePasswordCreationDomainService,
  UserAccountState,
  UserSubscriptionType,
} from '@basketcol/domain';

import { CreateHostUserDTO } from '../dtos/CreateHostUserDTO';
import { ICreateHostUserUseCase } from './ports/ICreateHostUserUseCase';
import { MultipleHostUsersException } from '../exceptions/MultipleHostUsersException';
import { InvalidHostUserCredentialsError } from '../exceptions/InvalidHostUserCredentialsError';
import { IHostUserConfigFactory } from '../ports/IHostUserConfigFactory';

type Dependencies = {
  hostUserConfigFactory: IHostUserConfigFactory;
  hostUserRepository: IHostUserRepository;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  businessDateDomainService: BusinessDateDomainService;
};

export class CreateHostUserUseCase implements ICreateHostUserUseCase {
  readonly #hostUserConfigFactory: IHostUserConfigFactory;

  readonly #hostUserRepository: IHostUserRepository;

  readonly #businessDateDomainService: BusinessDateDomainService;

  private constructor(dependencies: Dependencies) {
    this.#hostUserConfigFactory = dependencies.hostUserConfigFactory;
    this.#hostUserRepository = dependencies.hostUserRepository;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
  }

  public static create(dependencies: Dependencies): CreateHostUserUseCase {
    return new CreateHostUserUseCase(dependencies);
  }

  public async execute(dto: CreateHostUserDTO): Promise<void> {
    const hostUserFound: Nullable<HostUser> = await this.#hostUserRepository.find();

    if (hostUserFound) {
      throw MultipleHostUsersException.create();
    }

    const {
      id,
      name,
      biography,
      email,
      password,
      profileImage,
    } = dto;

    const hostUserCredentials = this.#hostUserConfigFactory.createHostUserCredentials();

    const isValidEmail: boolean = email.value === hostUserCredentials.email.value;
    const isValidPassword: boolean = password === hostUserCredentials.password;

    if (isValidEmail === false || isValidPassword === false) {
      throw InvalidHostUserCredentialsError.create();
    }

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.premium;
    const hostUserCreatedAt: HostUserCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const hostUserUpdatedAt: HostUserUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const hostUser: HostUser = HostUser.create(
      id,
      name,
      biography,
      { value: email.value, verified: true },
      password,
      'OTHER',
      accountState,
      subscriptionType,
      profileImage,
      hostUserCreatedAt.value,
      hostUserUpdatedAt.value,
    );

    return this.#hostUserRepository.save(hostUser);
  }
}
