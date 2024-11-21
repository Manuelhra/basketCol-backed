import {
  BusinessDateDomainService,
  EmailUniquenessValidatorDomainService,
  IdUniquenessValidatorDomainService,
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
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly emailUniquenessValidatorDomainService: EmailUniquenessValidatorDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly teamFounderUserRepository: ITeamFounderUserRepository;
};

export class CreateTeamFounderUserUseCase implements ICreateTeamFounderUserUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #emailUniquenessValidatorDomainService: EmailUniquenessValidatorDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #teamFounderUserRepository: ITeamFounderUserRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#emailUniquenessValidatorDomainService = dependencies.emailUniquenessValidatorDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
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
      gender,
      email,
      password,
      profileImage,
    } = dto;

    const teamFounderUserId: TeamFounderUserId = TeamFounderUserId.create(id);
    const teamFounderUserEmail: TeamFounderUserEmail = TeamFounderUserEmail.create({ value: email.value, verified: false });

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<TeamFounderUserId, ITeamFounderUserPrimitives, TeamFounderUser>(teamFounderUserId);
    await this.#emailUniquenessValidatorDomainService.ensureUniqueEmail<TeamFounderUserEmail, ITeamFounderUserPrimitives, TeamFounderUser>(teamFounderUserEmail);

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.free;
    const teamFounderUserCreatedAt: TeamFounderUserCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const teamFounderUserUpdatedAt: TeamFounderUserUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const teamFounderUser: TeamFounderUser = TeamFounderUser.create(
      teamFounderUserId.value,
      name,
      biography,
      teamFounderUserEmail.value,
      password,
      gender,
      accountState,
      subscriptionType,
      profileImage,
      teamFounderUserCreatedAt.value,
      teamFounderUserUpdatedAt.value,
    );

    return this.#teamFounderUserRepository.save(teamFounderUser);
  }
}
