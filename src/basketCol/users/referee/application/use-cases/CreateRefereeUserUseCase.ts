import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  HostUserType,
  IdUniquenessValidatorService,
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
  readonly idUniquenessValidatorService: IdUniquenessValidatorService;
  readonly emailUniquenessValidatorService: EmailUniquenessValidatorService;
  readonly businessDateService: BusinessDateService;
  readonly refereeUserRepository: IRefereeUserRepository;
};

export class CreateRefereeUserUseCase implements ICreateRefereeUserUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #businessDateService: BusinessDateService;

  readonly #refereeUserRepository: IRefereeUserRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#businessDateService = dependencies.businessDateService;
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
      email,
      password,
      profileImage,
    } = dto;

    const refereeUserId: RefereeUserId = RefereeUserId.create(id);
    const refereeUserEmail: RefereeUserEmail = RefereeUserEmail.create({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<RefereeUserId, IRefereeUserPrimitives, RefereeUser>(refereeUserId);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<RefereeUserEmail, IRefereeUserPrimitives, RefereeUser>(refereeUserEmail);

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.free;
    const refereeUserCreatedAt: RefereeUserCreatedAt = this.#businessDateService.getCurrentDate();
    const refereeUserUpdatedAt: RefereeUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const refereeUser: RefereeUser = RefereeUser.create(
      refereeUserId.value,
      name,
      biography,
      refereeUserEmail.value,
      password,
      accountState,
      subscriptionType,
      profileImage,
      refereeUserCreatedAt.value,
      refereeUserUpdatedAt.value,
    );

    return this.#refereeUserRepository.save(refereeUser);
  }
}
