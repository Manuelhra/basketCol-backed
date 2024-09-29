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

import { ValidateAndRefreshAuthenticationTokenDTO } from '../dtos/ValidateAndRefreshAuthenticationTokenDTO';
import { ITokenGeneratorService } from '../services/ITokenGeneratorService';
import { ITokenValidatorService } from '../services/ITokenValidatorService';
import { IValidateAndRefreshAuthenticationTokenUseCase } from './ports/IValidateAndRefreshAuthenticationTokenUseCase';
import { InvalidAuthenticationTokenError } from '../exceptions/InvalidAuthenticationTokenError';
import { UserNotFoundError } from '../../../users/shared/application/exceptions/UserNotFoundError';

type Dependencies = {
  tokenValidatorService: ITokenValidatorService;
  playerUserRepository: IPlayerUserRepository;
  hostUserRepository: IHostUserRepository;
  refereeUserRepository: IRefereeUserRepository;
  teamFounderUserRepository: ITeamFounderUserRepository;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
  tokenGeneratorService: ITokenGeneratorService;
};

export class ValidateAndRefreshAuthenticationTokenUseCase implements IValidateAndRefreshAuthenticationTokenUseCase {
  readonly #tokenValidatorService: ITokenValidatorService;

  readonly #playerUserRepository: IPlayerUserRepository;

  readonly #hostUserRepository: IHostUserRepository;

  readonly #refereeUserRepository: IRefereeUserRepository;

  readonly #teamFounderUserRepository: ITeamFounderUserRepository;

  readonly #leagueFounderUserRepository: ILeagueFounderUserRepository;

  readonly #tokenGeneratorService: ITokenGeneratorService;

  private constructor(dependencies: Dependencies) {
    this.#tokenValidatorService = dependencies.tokenValidatorService;
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#hostUserRepository = dependencies.hostUserRepository;
    this.#refereeUserRepository = dependencies.refereeUserRepository;
    this.#teamFounderUserRepository = dependencies.teamFounderUserRepository;
    this.#leagueFounderUserRepository = dependencies.leagueFounderUserRepository;
    this.#tokenGeneratorService = dependencies.tokenGeneratorService;
  }

  public static create(dependencies: Dependencies): ValidateAndRefreshAuthenticationTokenUseCase {
    return new ValidateAndRefreshAuthenticationTokenUseCase(dependencies);
  }

  public async execute(dto: ValidateAndRefreshAuthenticationTokenDTO): Promise<{ newAuthenticationToken: string }> {
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
      newAuthenticationToken: this.#tokenGeneratorService.generateAuthenticationToken(userFound),
    };
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
