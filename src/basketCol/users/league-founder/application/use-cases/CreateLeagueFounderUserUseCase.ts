import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  ILeagueFounderUser,
  ILeagueFounderUserRepository,
  LeagueFounderUser,
  LeagueFounderUserCreatedAt,
  LeagueFounderUserEmail,
  LeagueFounderUserId,
  LeagueFounderUserPassword,
  LeagueFounderUserUpdatedAt,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { CreateLeagueFounderUserDTO } from '../dtos/CreateLeagueFounderUserDTO';
import { ICreateLeagueFounderUserUseCase } from './ports/ICreateLeagueFounderUserUseCase';

export class CreateLeagueFounderUserUseCase implements ICreateLeagueFounderUserUseCase {
  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #securePasswordCreationService: SecurePasswordCreationService;

  readonly #leagueFounderUserRepository: ILeagueFounderUserRepository;

  readonly #businessDateService: BusinessDateService;

  constructor(dependencies: {
    emailUniquenessValidatorService: EmailUniquenessValidatorService
    idUniquenessValidatorService: IdUniquenessValidatorService;
    securePasswordCreationService: SecurePasswordCreationService;
    leagueFounderUserRepository: ILeagueFounderUserRepository;
    businessDateService: BusinessDateService;
  }) {
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
    this.#leagueFounderUserRepository = dependencies.leagueFounderUserRepository;
    this.#businessDateService = dependencies.businessDateService;
  }

  public async execute(dto: CreateLeagueFounderUserDTO): Promise<void> {
    const {
      id,
      email,
      name,
      biography,
      password,
    } = dto;

    const leagueFounderUserId: LeagueFounderUserId = new LeagueFounderUserId(id);
    const leagueFounderUserEmail: LeagueFounderUserEmail = new LeagueFounderUserEmail({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<LeagueFounderUserId, ILeagueFounderUser, LeagueFounderUser>(leagueFounderUserId);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<LeagueFounderUserEmail, ILeagueFounderUser, LeagueFounderUser>(leagueFounderUserEmail);

    const active: boolean = true;
    const leagueFounderUserPassword: LeagueFounderUserPassword = this.#securePasswordCreationService.createFromPlainText<LeagueFounderUserPassword>(password);
    const leagueFounderUserCreatedAt: LeagueFounderUserCreatedAt = this.#businessDateService.getCurrentDate();
    const leagueFounderUserUpdatedAt: LeagueFounderUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const leagueFounderUser: LeagueFounderUser = LeagueFounderUser.create(
      leagueFounderUserId.value,
      name,
      biography,
      leagueFounderUserEmail.value,
      leagueFounderUserPassword.value,
      active,
      leagueFounderUserCreatedAt.value,
      leagueFounderUserUpdatedAt.value,
    );

    return this.#leagueFounderUserRepository.save(leagueFounderUser);
  }
}
