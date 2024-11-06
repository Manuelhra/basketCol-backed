import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  HostUserType,
  IdUniquenessValidatorService,
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
  emailUniquenessValidatorService: EmailUniquenessValidatorService
  idUniquenessValidatorService: IdUniquenessValidatorService;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
  businessDateService: BusinessDateService;
};

export class CreateLeagueFounderUserUseCase implements ICreateLeagueFounderUserUseCase {
  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #leagueFounderUserRepository: ILeagueFounderUserRepository;

  readonly #businessDateService: BusinessDateService;

  private constructor(dependencies: Dependencies) {
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#leagueFounderUserRepository = dependencies.leagueFounderUserRepository;
    this.#businessDateService = dependencies.businessDateService;
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
      password,
      profileImage,
    } = dto;

    const leagueFounderUserId: LeagueFounderUserId = LeagueFounderUserId.create(id);
    const leagueFounderUserEmail: LeagueFounderUserEmail = LeagueFounderUserEmail.create({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<LeagueFounderUserId, ILeagueFounderUserPrimitives, LeagueFounderUser>(leagueFounderUserId);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<LeagueFounderUserEmail, ILeagueFounderUserPrimitives, LeagueFounderUser>(leagueFounderUserEmail);

    const accountState: string = UserAccountState.active;
    const subscriptionType: string = UserSubscriptionType.free;
    const leagueFounderUserCreatedAt: LeagueFounderUserCreatedAt = this.#businessDateService.getCurrentDate();
    const leagueFounderUserUpdatedAt: LeagueFounderUserUpdatedAt = this.#businessDateService.getCurrentDate();

    const leagueFounderUser: LeagueFounderUser = LeagueFounderUser.create(
      leagueFounderUserId.value,
      name,
      biography,
      leagueFounderUserEmail.value,
      password,
      accountState,
      subscriptionType,
      profileImage,
      leagueFounderUserCreatedAt.value,
      leagueFounderUserUpdatedAt.value,
    );

    return this.#leagueFounderUserRepository.save(leagueFounderUser);
  }
}
