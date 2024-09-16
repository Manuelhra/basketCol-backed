import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  ITeamFounderUser,
  ITFURepository,
  SecurePasswordCreationService,
  TeamFounderUser,
  TeamFounderUserId,
  TFUCreatedAt,
  TFUEmail,
  TFUPassword,
  TFUUpdatedAt,
} from '@basketcol/domain';

import { CreateTeamFounderUserDTO } from '../dtos/CreateTeamFounderUserDTO';
import { ICreateTeamFounderUserUseCase } from './ports/ICreateTeamFounderUserUseCase';

export class CreateTeamFounderUserUseCase implements ICreateTeamFounderUserUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #securePasswordCreationService: SecurePasswordCreationService;

  readonly #businessDateService: BusinessDateService;

  readonly #tFURepository: ITFURepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    emailUniquenessValidatorService: EmailUniquenessValidatorService;
    securePasswordCreationService: SecurePasswordCreationService;
    businessDateService: BusinessDateService;
    tFURepository: ITFURepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#securePasswordCreationService = dependencies.securePasswordCreationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#tFURepository = dependencies.tFURepository;
  }

  public async execute(dto: CreateTeamFounderUserDTO): Promise<void> {
    const {
      id,
      name,
      biography,
      email,
      password,
    } = dto;

    const teamFounderUserId: TeamFounderUserId = new TeamFounderUserId(id);
    const tFUEmail: TFUEmail = new TFUEmail({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<TeamFounderUserId, ITeamFounderUser, TeamFounderUser>(teamFounderUserId);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<TFUEmail, ITeamFounderUser, TeamFounderUser>(tFUEmail);

    const active: boolean = true;
    const tFUPassword: TFUPassword = this.#securePasswordCreationService.createFromPlainText<TFUPassword>(password);
    const tFUCreatedAt: TFUCreatedAt = this.#businessDateService.getCurrentDate();
    const tFUUpdatedAt: TFUUpdatedAt = this.#businessDateService.getCurrentDate();

    const teamFounderUser: TeamFounderUser = TeamFounderUser.create(
      teamFounderUserId.value,
      name,
      biography,
      tFUEmail.value,
      tFUPassword.value,
      active,
      tFUCreatedAt.value,
      tFUUpdatedAt.value,
    );

    return this.#tFURepository.save(teamFounderUser);
  }
}
