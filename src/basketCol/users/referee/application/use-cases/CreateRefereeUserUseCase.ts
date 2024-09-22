import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  IRefereeUser,
  IRefereeUserRepository,
  RefereeUser,
  RefereeUserAccountState,
  RefereeUserCreatedAt,
  RefereeUserEmail,
  RefereeUserId,
  RefereeUserSubscriptionType,
  RefereeUserUpdatedAt,
} from '@basketcol/domain';

import { CreateRefereeUserDTO } from '../dtos/CreateRefereeUserDTO';
import { ICreateRefereeUserUseCase } from './ports/ICreateRefereeUserUseCase';

export class CreateRefereeUserUseCase implements ICreateRefereeUserUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #businessDateService: BusinessDateService;

  readonly #refereeUserRepository: IRefereeUserRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    emailUniquenessValidatorService: EmailUniquenessValidatorService;
    businessDateService: BusinessDateService;
    refereeUserRepository: IRefereeUserRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#businessDateService = dependencies.businessDateService;
    this.#refereeUserRepository = dependencies.refereeUserRepository;
  }

  public async execute(dto: CreateRefereeUserDTO): Promise<void> {
    const {
      id,
      name,
      biography,
      email,
      password,
    } = dto;

    const refereeUserId: RefereeUserId = RefereeUserId.create(id);
    const refereeUserEmail: RefereeUserEmail = RefereeUserEmail.create({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<RefereeUserId, IRefereeUser, RefereeUser>(refereeUserId);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<RefereeUserEmail, IRefereeUser, RefereeUser>(refereeUserEmail);

    const accountState: string = RefereeUserAccountState.active;
    const subscriptionType: string = RefereeUserSubscriptionType.free;
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
      refereeUserCreatedAt.value,
      refereeUserUpdatedAt.value,
    );

    return this.#refereeUserRepository.save(refereeUser);
  }
}
