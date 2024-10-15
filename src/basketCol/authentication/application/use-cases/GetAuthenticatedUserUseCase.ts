import {
  AnySystemUserType,
  HostUserId,
  HostUserType,
  IHostUserRepository,
  ILeagueFounderUserRepository,
  InvalidUserTypeError,
  IPlayerUserRepository,
  IRefereeUserRepository,
  ITeamFounderUserRepository,
  LeagueFounderUserId,
  LeagueFounderUserType,
  Nullable,
  PlayerUserId,
  PlayerUserType,
  RefereeUserId,
  RefereeUserType,
  TeamFounderUserId,
  TeamFounderUserType,
} from '@basketcol/domain';

import { GetAuthenticatedUserDTO } from '../dtos/GetAuthenticatedUserDTO';
import { IGetAuthenticatedUserUseCase } from './ports/IGetAuthenticatedUserUseCase';
import { ITokenValidatorService } from '../services/ITokenValidatorService';
import { InvalidAuthenticationTokenError } from '../exceptions/InvalidAuthenticationTokenError';
import { UserNotFoundError } from '../../../users/shared/application/exceptions/UserNotFoundError';

type Dependencies = {
  tokenValidatorService: ITokenValidatorService;
  playerUserRepository: IPlayerUserRepository;
  hostUserRepository: IHostUserRepository;
  refereeUserRepository: IRefereeUserRepository;
  teamFounderUserRepository: ITeamFounderUserRepository;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
};

export class GetAuthenticatedUserUseCase implements IGetAuthenticatedUserUseCase {
  readonly #tokenValidatorService: ITokenValidatorService;

  readonly #playerUserRepository: IPlayerUserRepository;

  readonly #hostUserRepository: IHostUserRepository;

  readonly #refereeUserRepository: IRefereeUserRepository;

  readonly #teamFounderUserRepository: ITeamFounderUserRepository;

  readonly #leagueFounderUserRepository: ILeagueFounderUserRepository;

  private constructor(dependencies: Dependencies) {
    this.#tokenValidatorService = dependencies.tokenValidatorService;
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#hostUserRepository = dependencies.hostUserRepository;
    this.#refereeUserRepository = dependencies.refereeUserRepository;
    this.#teamFounderUserRepository = dependencies.teamFounderUserRepository;
    this.#leagueFounderUserRepository = dependencies.leagueFounderUserRepository;
  }

  public async execute(dto: GetAuthenticatedUserDTO): Promise<{ authenticatedUser: AnySystemUserType; }> {
    const { authenticationToken } = dto;

    const userAuthenticationTokenPayload = this.#tokenValidatorService.validateAuthenticationToken(authenticationToken);

    if (userAuthenticationTokenPayload === null) {
      throw InvalidAuthenticationTokenError.create();
    }

    const userFound = await this.#findUserByType(userAuthenticationTokenPayload.userType, userAuthenticationTokenPayload.userId);

    if (userFound === null || userFound === undefined) {
      throw UserNotFoundError.create(userAuthenticationTokenPayload.userId);
    }

    return {
      authenticatedUser: userFound,
    };
  }

  public static create(dependencies: Dependencies): GetAuthenticatedUserUseCase {
    return new GetAuthenticatedUserUseCase(dependencies);
  }

  async #findUserByType(userType: string, userId: string): Promise<Nullable<AnySystemUserType>> {
    let userFound: Nullable<AnySystemUserType> = null;

    switch (userType) {
      case PlayerUserType.value:
        userFound = await this.#playerUserRepository.searchById(PlayerUserId.create(userId));
        break;

      case HostUserType.value:
        userFound = await this.#hostUserRepository.searchById(HostUserId.create(userId));
        break;

      case LeagueFounderUserType.value:
        userFound = await this.#leagueFounderUserRepository.searchById(LeagueFounderUserId.create(userId));
        break;

      case RefereeUserType.value:
        userFound = await this.#refereeUserRepository.searchById(RefereeUserId.create(userId));
        break;

      case TeamFounderUserType.value:
        userFound = await this.#teamFounderUserRepository.searchById(TeamFounderUserId.create(userId));
        break;

      default:
        throw InvalidUserTypeError.create(userType);
    }

    return userFound;
  }
}
