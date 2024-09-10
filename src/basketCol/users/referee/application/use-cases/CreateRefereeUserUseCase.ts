import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  IRefereeUser,
  IRefereeUserRepository,
  RefereeUser,
  RefereeUserCreatedAt,
  RefereeUserEmail,
  RefereeUserId,
  RefereeUserPassword,
  RefereeUserUpdatedAt,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { CreateRefereeUserDTO } from '../dtos/CreateRefereeUserDTO';
import { ICreateRefereeUserUseCase } from './ports/ICreateRefereeUserUseCase';

export class CreateRefereeUserUseCase implements ICreateRefereeUserUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #securePasswordCreationService: SecurePasswordCreationService;

  readonly #businessDateService: BusinessDateService;

  readonly #refereeUserRepository: IRefereeUserRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    emailUniquenessValidatorService: EmailUniquenessValidatorService;
    securePasswordCreationService: SecurePasswordCreationService;
    businessDateService: BusinessDateService;
    refereeUserRepository: IRefereeUserRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
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

    const refereeUserId: RefereeUserId = new RefereeUserId(id);
    const refereeUserEmail: RefereeUserEmail = new RefereeUserEmail({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<RefereeUserId, IRefereeUser, RefereeUser>(refereeUserId);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<RefereeUserEmail, IRefereeUser, RefereeUser>(refereeUserEmail);

    const active: boolean = true;
    const refereeUserPassword: RefereeUserPassword = this.#securePasswordCreationService.createFromPlainText<RefereeUserPassword>(password);
    const refereeUserCreatedAt: RefereeUserCreatedAt = this.#businessDateService.getCurrentDate();
    const refereeUserUpdatedAt: RefereeUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const refereeUser: RefereeUser = new RefereeUser(
      refereeUserId.value,
      name,
      biography,
      refereeUserEmail.value,
      refereeUserPassword.value,
      active,
      refereeUserCreatedAt.value,
      refereeUserUpdatedAt.value,
    );

    return this.#refereeUserRepository.save(refereeUser);
  }
}
