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
  HostUserType,
} from '@basketcol/domain';

import { CreateTeamFounderUserDTO } from '../dtos/CreateTeamFounderUserDTO';
import { ICreateTeamFounderUserUseCase } from './ports/ICreateTeamFounderUserUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly idUniquenessValidatorService: IdUniquenessValidatorService;
  readonly emailUniquenessValidatorService: EmailUniquenessValidatorService;
  readonly businessDateService: BusinessDateService;
  readonly teamFounderUserRepository: ITeamFounderUserRepository;
};

export class CreateTeamFounderUserUseCase implements ICreateTeamFounderUserUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #businessDateService: BusinessDateService;

  readonly #teamFounderUserRepository: ITeamFounderUserRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#businessDateService = dependencies.businessDateService;
    this.#teamFounderUserRepository = dependencies.teamFounderUserRepository;
  }

  public static create(dependencies: Dependencies): CreateTeamFounderUserUseCase {
    return new CreateTeamFounderUserUseCase(dependencies);
  }

  public async execute(dto: CreateTeamFounderUserDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a team founder user');
    }

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

    return this.#teamFounderUserRepository.save(teamFounderUser);
  }
}
