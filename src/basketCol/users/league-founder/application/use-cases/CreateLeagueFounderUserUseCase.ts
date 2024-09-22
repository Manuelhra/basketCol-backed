import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  ILeagueFounderUser,
  ILeagueFounderUserRepository,
  LeagueFounderUser,
  LeagueFounderUserAccountState,
  LeagueFounderUserCreatedAt,
  LeagueFounderUserEmail,
  LeagueFounderUserId,
  LeagueFounderUserSubscriptionType,
  LeagueFounderUserUpdatedAt,
} from '@basketcol/domain';

import { CreateLeagueFounderUserDTO } from '../dtos/CreateLeagueFounderUserDTO';
import { ICreateLeagueFounderUserUseCase } from './ports/ICreateLeagueFounderUserUseCase';

export class CreateLeagueFounderUserUseCase implements ICreateLeagueFounderUserUseCase {
  readonly #emailUniquenessValidatorService: EmailUniquenessValidatorService;

  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #leagueFounderUserRepository: ILeagueFounderUserRepository;

  readonly #businessDateService: BusinessDateService;

  constructor(dependencies: {
    emailUniquenessValidatorService: EmailUniquenessValidatorService
    idUniquenessValidatorService: IdUniquenessValidatorService;
    leagueFounderUserRepository: ILeagueFounderUserRepository;
    businessDateService: BusinessDateService;
  }) {
    this.#emailUniquenessValidatorService = dependencies.emailUniquenessValidatorService;
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
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

    const leagueFounderUserId: LeagueFounderUserId = LeagueFounderUserId.create(id);
    const leagueFounderUserEmail: LeagueFounderUserEmail = LeagueFounderUserEmail.create({ value: email.value, verified: false });

    await this.#idUniquenessValidatorService.ensureUniqueId<LeagueFounderUserId, ILeagueFounderUser, LeagueFounderUser>(leagueFounderUserId);
    await this.#emailUniquenessValidatorService.ensureUniqueEmail<LeagueFounderUserEmail, ILeagueFounderUser, LeagueFounderUser>(leagueFounderUserEmail);

    const accountState: string = LeagueFounderUserAccountState.active;
    const subscriptionType: string = LeagueFounderUserSubscriptionType.free;
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
      leagueFounderUserCreatedAt.value,
      leagueFounderUserUpdatedAt.value,
    );

    return this.#leagueFounderUserRepository.save(leagueFounderUser);
  }
}
