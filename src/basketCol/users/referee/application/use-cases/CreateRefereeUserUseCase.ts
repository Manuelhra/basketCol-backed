import {
  BusinessDateDomainService,
  EmailUniquenessValidatorDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  IRefereeUserPrimitives,
  IRefereeUserRepository,
  RefereeUser,
  RefereeUserCreatedAt,
  RefereeUserEmail,
  RefereeUserId,
  RefereeUserUpdatedAt,
  UserAccountState,
  UserSubscriptionType,
} from '@basketcol/domain';

import { CreateRefereeUserDTO } from '../dtos/CreateRefereeUserDTO';
import { ICreateRefereeUserUseCase } from './ports/ICreateRefereeUserUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly emailUniquenessValidatorDomainService: EmailUniquenessValidatorDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly refereeUserRepository: IRefereeUserRepository;
};

export class CreateRefereeUserUseCase implements ICreateRefereeUserUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #emailUniquenessValidatorDomainService: EmailUniquenessValidatorDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #refereeUserRepository: IRefereeUserRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#emailUniquenessValidatorDomainService = dependencies.emailUniquenessValidatorDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#refereeUserRepository = dependencies.refereeUserRepository;
  }

  public static create(dependencies: Dependencies): CreateRefereeUserUseCase {
    return new CreateRefereeUserUseCase(dependencies);
  }

  public async execute(dto: CreateRefereeUserDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a referee user');
    }

    const {
      id,
      name,
      biography,
      gender,
      email,
      password,
      profileImage,
    } = dto;

    const refereeUserId: RefereeUserId = RefereeUserId.create(id);
    const refereeUserEmail: RefereeUserEmail = RefereeUserEmail.create({ value: email.value, verified: false });

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<RefereeUserId, IRefereeUserPrimitives, RefereeUser>(refereeUserId);
    await this.#emailUniquenessValidatorDomainService.ensureUniqueEmail<RefereeUserEmail, IRefereeUserPrimitives, RefereeUser>(refereeUserEmail);

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.free;
    const refereeUserCreatedAt: RefereeUserCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const refereeUserUpdatedAt: RefereeUserUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const refereeUser: RefereeUser = RefereeUser.create(
      refereeUserId.value,
      name,
      biography,
      refereeUserEmail.value,
      password,
      gender,
      accountState,
      subscriptionType,
      profileImage,
      refereeUserCreatedAt.value,
      refereeUserUpdatedAt.value,
    );

    return this.#refereeUserRepository.save(refereeUser);
  }
}
