import {
  AnySystemUserType,
  HostUser,
  HostUserEmail,
  HostUserPassword,
  HostUserType,
  IHostUserRepository,
  ILeagueFounderUserRepository,
  InvalidUserTypeError,
  IPlayerUserRepository,
  IRefereeUserRepository,
  ITeamFounderUserRepository,
  LeagueFounderUser,
  LeagueFounderUserEmail,
  LeagueFounderUserPassword,
  LeagueFounderUserType,
  Nullable,
  PlayerUser,
  PlayerUserEmail,
  PlayerUserNickname,
  PlayerUserPassword,
  PlayerUserType,
  RefereeUser,
  RefereeUserEmail,
  RefereeUserPassword,
  RefereeUserType,
  TeamFounderUser,
  TeamFounderUserEmail,
  TeamFounderUserPassword,
  TeamFounderUserType,
} from '@basketcol/domain';

import { AuthenticateUserDTO } from '../dtos/AuthenticateUserDTO';
import { MissingCredentialsError } from '../exceptions/MissingCredentialsError';
import { MissingEmailError } from '../exceptions/MissingEmailError';
import { PasswordValidationService } from '../services/PasswordValidationService';
import { ITokenGeneratorService } from '../services/ITokenGeneratorService';
import { InvalidCredentialsError } from '../exceptions/InvalidCredentialsError';
import { IAuthenticateUserUseCase } from './ports/IAuthenticateUserUseCase';

type Dependencies = {
  readonly playerUserRepository: IPlayerUserRepository;
  readonly hostUserRepository: IHostUserRepository;
  readonly refereeUserRepository: IRefereeUserRepository;
  readonly teamFounderUserRepository: ITeamFounderUserRepository;
  readonly leagueFounderUserRepository: ILeagueFounderUserRepository;
  readonly passwordValidationService: PasswordValidationService;
  readonly tokenGeneratorService: ITokenGeneratorService;
};

export class AuthenticateUserUseCase implements IAuthenticateUserUseCase {
  readonly #playerUserRepository: IPlayerUserRepository;

  readonly #hostUserRepository: IHostUserRepository;

  readonly #refereeUserRepository: IRefereeUserRepository;

  readonly #teamFounderUserRepository: ITeamFounderUserRepository;

  readonly #leagueFounderUserRepository: ILeagueFounderUserRepository;

  readonly #passwordValidationService: PasswordValidationService;

  readonly #tokenGeneratorService: ITokenGeneratorService;

  private constructor(dependencies: Dependencies) {
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#hostUserRepository = dependencies.hostUserRepository;
    this.#refereeUserRepository = dependencies.refereeUserRepository;
    this.#teamFounderUserRepository = dependencies.teamFounderUserRepository;
    this.#leagueFounderUserRepository = dependencies.leagueFounderUserRepository;
    this.#passwordValidationService = dependencies.passwordValidationService;
    this.#tokenGeneratorService = dependencies.tokenGeneratorService;
  }

  public static create(dependencies: Dependencies): AuthenticateUserUseCase {
    return new AuthenticateUserUseCase(dependencies);
  }

  public async execute(dto: AuthenticateUserDTO): Promise<{ authenticatedUser: AnySystemUserType; authenticationToken: string; }> {
    const {
      nickname,
      email,
      password,
      userType,
    } = dto;

    let userFound: Nullable<AnySystemUserType>;

    switch (userType) {
      case PlayerUserType.value:
        userFound = await this.#authenticatePlayerUser(
          PlayerUserPassword.create(password),
          nickname !== undefined ? PlayerUserNickname.create(nickname) : undefined,
          email !== undefined ? PlayerUserEmail.create({ value: email, verified: true }) : undefined,
        );
        break;

      case HostUserType.value: {
        if (email === undefined || email === null) {
          throw MissingEmailError.create();
        }

        const hostUserEmail = HostUserEmail.create({ value: email, verified: true });
        const hostUserPassword = HostUserPassword.create(password);

        userFound = await this.#authenticateHostUser(hostUserEmail, hostUserPassword);
        break;
      }

      case LeagueFounderUserType.value: {
        if (email === undefined || email === null) {
          throw MissingEmailError.create();
        }

        const leagueFounderUserEmail = LeagueFounderUserEmail.create({ value: email, verified: true });
        const leagueFounderUserPassword = LeagueFounderUserPassword.create(password);

        userFound = await this.#authenticateLeagueFounderUser(leagueFounderUserEmail, leagueFounderUserPassword);
        break;
      }

      case RefereeUserType.value: {
        if (email === undefined || email === null) {
          throw MissingEmailError.create();
        }

        const refereeUserEmail = RefereeUserEmail.create({ value: email, verified: true });
        const refereeUserPassword = RefereeUserPassword.create(password);

        userFound = await this.#authenticateRefereeUser(refereeUserEmail, refereeUserPassword);
        break;
      }

      case TeamFounderUserType.value: {
        if (email === undefined || email === null) {
          throw MissingEmailError.create();
        }

        const teamFounderUserEmail = TeamFounderUserEmail.create({ value: email, verified: true });
        const teamFounderUserPassword = TeamFounderUserPassword.create(password);

        userFound = await this.#authenticateTeamFounderUser(teamFounderUserEmail, teamFounderUserPassword);
        break;
      }

      default:
        throw InvalidUserTypeError.create(userType);
    }

    if (userFound === null || userFound === undefined) {
      throw InvalidCredentialsError.create();
    }

    return {
      authenticatedUser: userFound,
      authenticationToken: this.#tokenGeneratorService.generateAuthenticationToken(userFound),
    };
  }

  async #authenticatePlayerUser(
    playerUserPassword: PlayerUserPassword,
    playerUserNickname: Nullable<PlayerUserNickname>,
    playerUserEmail: Nullable<PlayerUserEmail>,
  ): Promise<Nullable<PlayerUser>> {
    if (playerUserNickname === undefined && playerUserEmail === undefined) {
      throw MissingCredentialsError.create();
    }

    let playerUserFound: Nullable<PlayerUser> = null;

    if (playerUserNickname !== undefined && playerUserNickname !== null) {
      playerUserFound = await this.#playerUserRepository.findByNickname(playerUserNickname);
    } else if (playerUserEmail !== undefined && playerUserEmail !== null) {
      playerUserFound = await this.#playerUserRepository.findByEmail(playerUserEmail);
    }

    if (playerUserFound === null || playerUserFound === undefined) {
      return null;
    }

    const isPasswordValid = await this.#passwordValidationService.validate(playerUserPassword, playerUserFound.password);
    return isPasswordValid ? playerUserFound : null;
  }

  async #authenticateHostUser(hostUserEmail: HostUserEmail, hostUserPassword: HostUserPassword): Promise<Nullable<HostUser>> {
    const hostUserFound = await this.#hostUserRepository.findByEmail(hostUserEmail);
    if (hostUserFound === null || hostUserFound === undefined) {
      return null;
    }

    const isPasswordValid = await this.#passwordValidationService.validate(hostUserPassword, hostUserFound.password);
    return isPasswordValid ? hostUserFound : null;
  }

  async #authenticateRefereeUser(refereeUserEmail: RefereeUserEmail, refereeUserPassword: RefereeUserPassword): Promise<Nullable<RefereeUser>> {
    const refereeUserFound = await this.#refereeUserRepository.findByEmail(refereeUserEmail);
    if (refereeUserFound === null || refereeUserFound === undefined) {
      return null;
    }

    const isPasswordValid = await this.#passwordValidationService.validate(refereeUserPassword, refereeUserFound.password);
    return isPasswordValid ? refereeUserFound : null;
  }

  async #authenticateLeagueFounderUser(
    leagueFounderUserEmail: LeagueFounderUserEmail,
    leagueFounderUserPassword: LeagueFounderUserPassword,
  ): Promise<Nullable<LeagueFounderUser>> {
    const leagueFounderUserFound = await this.#leagueFounderUserRepository.findByEmail(leagueFounderUserEmail);
    if (leagueFounderUserFound === null || leagueFounderUserFound === undefined) {
      return null;
    }

    const isPasswordValid = await this.#passwordValidationService.validate(leagueFounderUserPassword, leagueFounderUserFound.password);
    return isPasswordValid ? leagueFounderUserFound : null;
  }

  async #authenticateTeamFounderUser(teamFounderUserEmail: TeamFounderUserEmail, teamFounderUserPassword: TeamFounderUserPassword): Promise<Nullable<TeamFounderUser>> {
    const teamFounderUserFound = await this.#teamFounderUserRepository.findByEmail(teamFounderUserEmail);
    if (teamFounderUserFound === null || teamFounderUserFound === undefined) {
      return null;
    }

    const isPasswordValid = await this.#passwordValidationService.validate(teamFounderUserPassword, teamFounderUserFound.password);
    return isPasswordValid ? teamFounderUserFound : null;
  }
}
