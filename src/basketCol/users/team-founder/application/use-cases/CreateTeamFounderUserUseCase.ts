import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  ITeamFounderUserPrimitives,
  ITeamFounderUserRepository,
  TeamFounderUser,
  TeamFounderUserId,
  TeamFounderUserCreatedAt,
  TeamFounderUserEmail,
  TeamFounderUserUpdatedAt,
  UserAccountState,
  UserSubscriptionType,
} from '@basketcol/domain';

import { CreateTeamFounderUserDTO } from '../dtos/CreateTeamFounderUserDTO';
import { ICreateTeamFounderUserUseCase } from './ports/ICreateTeamFounderUserUseCase';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  emailUniquenessValidatorService: EmailUniquenessValidatorService;
  businessDateService: BusinessDateService;
  tFURepository: ITeamFounderUserRepository;
};

export class CreateTeamFounderUserUseCase implements ICreateTeamFounderUserUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #businessDateService: BusinessDateService;

  readonly #tFURepository: ITeamFounderUserRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#businessDateService = dependencies.businessDateService;
    this.#tFURepository = dependencies.tFURepository;
  }

  public static create(dependencies: Dependencies): CreateTeamFounderUserUseCase {
    return new CreateTeamFounderUserUseCase(dependencies);
  }

  public async execute(dto: CreateTeamFounderUserDTO): Promise<void> {
    const {
      id,
      name,
      biography,
      email,
      password,
      profileImage,
    } = dto;

    const teamFounderUserId: TeamFounderUserId = TeamFounderUserId.create(id);
    const teamFounderUserEmail: TeamFounderUserEmail = TeamFounderUserEmail.create({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<TeamFounderUserId, ITeamFounderUserPrimitives, TeamFounderUser>(teamFounderUserId);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<TeamFounderUserEmail, ITeamFounderUserPrimitives, TeamFounderUser>(teamFounderUserEmail);

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.free;
    const teamFounderUserCreatedAt: TeamFounderUserCreatedAt = this.#businessDateService.getCurrentDate();
    const teamFounderUserUpdatedAt: TeamFounderUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const teamFounderUser: TeamFounderUser = TeamFounderUser.create(
      teamFounderUserId.value,
      name,
      biography,
      teamFounderUserEmail.value,
      password,
      accountState,
      subscriptionType,
      profileImage,
      teamFounderUserCreatedAt.value,
      teamFounderUserUpdatedAt.value,
    );

    return this.#tFURepository.save(teamFounderUser);
  }
}
