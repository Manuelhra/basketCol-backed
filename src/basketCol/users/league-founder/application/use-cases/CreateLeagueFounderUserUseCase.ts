import {
  BusinessDateDomainService,
  EmailUniquenessValidatorDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  ILeagueFounderUserPrimitives,
  ILeagueFounderUserRepository,
  LeagueFounderUser,
  LeagueFounderUserCreatedAt,
  LeagueFounderUserEmail,
  LeagueFounderUserId,
  LeagueFounderUserUpdatedAt,
  UserAccountState,
  UserSubscriptionType,
} from '@basketcol/domain';

import { CreateLeagueFounderUserDTO } from '../dtos/CreateLeagueFounderUserDTO';
import { ICreateLeagueFounderUserUseCase } from './ports/ICreateLeagueFounderUserUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  emailUniquenessValidatorDomainService: EmailUniquenessValidatorDomainService
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
  businessDateDomainService: BusinessDateDomainService;
};

export class CreateLeagueFounderUserUseCase implements ICreateLeagueFounderUserUseCase {
  readonly #emailUniquenessValidatorDomainService: EmailUniquenessValidatorDomainService;

  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #leagueFounderUserRepository: ILeagueFounderUserRepository;

  readonly #businessDateDomainService: BusinessDateDomainService;

  private constructor(dependencies: Dependencies) {
    this.#emailUniquenessValidatorDomainService = dependencies.emailUniquenessValidatorDomainService;
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#leagueFounderUserRepository = dependencies.leagueFounderUserRepository;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
  }

  public static create(dependencies: Dependencies): CreateLeagueFounderUserUseCase {
    return new CreateLeagueFounderUserUseCase(dependencies);
  }

  public async execute(dto: CreateLeagueFounderUserDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a league founder user');
    }

    const {
      id,
      email,
      name,
      biography,
      gender,
      password,
      profileImage,
    } = dto;

    const leagueFounderUserId: LeagueFounderUserId = LeagueFounderUserId.create(id);
    const leagueFounderUserEmail: LeagueFounderUserEmail = LeagueFounderUserEmail.create({ value: email.value, verified: false });

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<LeagueFounderUserId, ILeagueFounderUserPrimitives, LeagueFounderUser>(leagueFounderUserId);
    await this.#emailUniquenessValidatorDomainService.ensureUniqueEmail<LeagueFounderUserEmail, ILeagueFounderUserPrimitives, LeagueFounderUser>(leagueFounderUserEmail);

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.free;
    const leagueFounderUserCreatedAt: LeagueFounderUserCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const leagueFounderUserUpdatedAt: LeagueFounderUserUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const leagueFounderUser: LeagueFounderUser = LeagueFounderUser.create(
      leagueFounderUserId.value,
      name,
      biography,
      leagueFounderUserEmail.value,
      password,
      gender,
      accountState,
      subscriptionType,
      profileImage,
      leagueFounderUserCreatedAt.value,
      leagueFounderUserUpdatedAt.value,
    );

    return this.#leagueFounderUserRepository.save(leagueFounderUser);
  }
}
