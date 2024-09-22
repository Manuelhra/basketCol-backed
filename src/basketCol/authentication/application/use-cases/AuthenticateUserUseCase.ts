import {
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
import { IAuthenticateUserUseCase, SomethingUser } from './ports/IAuthenticateUserUseCase';

export class AuthenticateUserUseCase implements IAuthenticateUserUseCase {
  readonly #playerUserRepository: IPlayerUserRepository;

  readonly #hostUserRepository: IHostUserRepository;

  readonly #refereeUserRepository: IRefereeUserRepository;

  readonly #teamFounderUserRepository: ITeamFounderUserRepository;

  readonly #leagueFounderUserRepository: ILeagueFounderUserRepository;

  readonly #passwordValidationService: PasswordValidationService;

  readonly #tokenGeneratorService: ITokenGeneratorService;

  constructor(dependencies: {
    playerUserRepository: IPlayerUserRepository;
    hostUserRepository: IHostUserRepository;
    refereeUserRepository: IRefereeUserRepository;
    teamFounderUserRepository: ITeamFounderUserRepository;
    leagueFounderUserRepository: ILeagueFounderUserRepository;
    passwordValidationService: PasswordValidationService;
    tokenGeneratorService: ITokenGeneratorService;
  }) {
    this.#playerUserRepository = dependencies.playerUserRepository;
    this.#hostUserRepository = dependencies.hostUserRepository;
    this.#refereeUserRepository = dependencies.refereeUserRepository;
    this.#teamFounderUserRepository = dependencies.teamFounderUserRepository;
    this.#leagueFounderUserRepository = dependencies.leagueFounderUserRepository;
    this.#passwordValidationService = dependencies.passwordValidationService;
    this.#tokenGeneratorService = dependencies.tokenGeneratorService;
  }

  public async execute(dto: AuthenticateUserDTO): Promise<{ user: SomethingUser; authenticationToken: string; }> {
    const {
      nickname,
      email,
      password,
      userType,
    } = dto;

    let user: Nullable<SomethingUser>;

    switch (userType) {
      case PlayerUserType.value:
        user = await this.authenticatePlayerUser(
          PlayerUserPassword.create(password),
          nickname !== undefined ? PlayerUserNickname.create(nickname) : undefined,
          email !== undefined ? PlayerUserEmail.create({ value: email, verified: true }) : undefined,
        );
        break;
      case HostUserType.value: {
        if (email === undefined || email === null) {
          throw new MissingEmailError();
        }

        const hostUserEmail = HostUserEmail.create({ value: email, verified: true });
        const hostUserPassword = HostUserPassword.create(password);

        user = await this.authenticateHostUser(hostUserEmail, hostUserPassword);
        break;
      }
      case LeagueFounderUserType.value: {
        if (email === undefined || email === null) {
          throw new MissingEmailError();
        }

        const leagueFounderUserEmail = LeagueFounderUserEmail.create({ value: email, verified: true });
        const leagueFounderUserPassword = LeagueFounderUserPassword.create(password);

        user = await this.authenticateLeagueFounderUser(leagueFounderUserEmail, leagueFounderUserPassword);
        break;
      }
      case RefereeUserType.value: {
        if (email === undefined || email === null) {
          throw new MissingEmailError();
        }

        const refereeUserEmail = RefereeUserEmail.create({ value: email, verified: true });
        const refereeUserPassword = RefereeUserPassword.create(password);

        user = await this.authenticateRefereeUser(refereeUserEmail, refereeUserPassword);
        break;
      }
      case TeamFounderUserType.value: {
        if (email === undefined || email === null) {
          throw new MissingEmailError();
        }

        const teamFounderUserEmail = TeamFounderUserEmail.create({ value: email, verified: true });
        const teamFounderUserPassword = TeamFounderUserPassword.create(password);

        user = await this.authenticateTeamFounderUser(teamFounderUserEmail, teamFounderUserPassword);
        break;
      }
      default:
        throw new InvalidUserTypeError(userType);
    }

    if (user === null || user === undefined) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
      authenticationToken: this.#tokenGeneratorService.generateAuthenticationToken(user),
    };
  }

  private async authenticatePlayerUser(
    playerUserPassword: PlayerUserPassword,
    playerUserNickname: Nullable<PlayerUserNickname>,
    playerUserEmail: Nullable<PlayerUserEmail>,
  ): Promise<Nullable<PlayerUser>> {
    if (playerUserNickname === undefined && playerUserEmail === undefined) {
      throw new MissingCredentialsError();
    }

    let user: Nullable<PlayerUser> = null;

    if (playerUserNickname !== undefined && playerUserNickname !== null) {
      user = await this.#playerUserRepository.searchByNickname(playerUserNickname);
    } else if (playerUserEmail !== undefined && playerUserEmail !== null) {
      user = await this.#playerUserRepository.searchByEmail(playerUserEmail);
    }

    if (user === null || user === undefined) {
      return null;
    }

    const isPasswordValid = await this.#passwordValidationService.validate(playerUserPassword, user.password);
    return isPasswordValid ? user : null;
  }

  private async authenticateHostUser(hostUserEmail: HostUserEmail, hostUserPassword: HostUserPassword): Promise<Nullable<HostUser>> {
    const user = await this.#hostUserRepository.searchByEmail(hostUserEmail);
    if (user === null || user === undefined) {
      return null;
    }

    const isPasswordValid = await this.#passwordValidationService.validate(hostUserPassword, user.password);
    return isPasswordValid ? user : null;
  }

  private async authenticateRefereeUser(refereeUserEmail: RefereeUserEmail, refereeUserPassword: RefereeUserPassword): Promise<Nullable<RefereeUser>> {
    const user = await this.#refereeUserRepository.searchByEmail(refereeUserEmail);
    if (user === null || user === undefined) {
      return null;
    }

    const isPasswordValid = await await this.#passwordValidationService.validate(refereeUserPassword, user.password);
    return isPasswordValid ? user : null;
  }

  private async authenticateLeagueFounderUser(
    leagueFounderUserEmail: LeagueFounderUserEmail,
    leagueFounderUserPassword: LeagueFounderUserPassword,
  ): Promise<Nullable<LeagueFounderUser>> {
    const user = await this.#leagueFounderUserRepository.searchByEmail(leagueFounderUserEmail);
    if (user === null || user === undefined) {
      return null;
    }

    const isPasswordValid = await this.#passwordValidationService.validate(leagueFounderUserPassword, user.password);
    return isPasswordValid ? user : null;
  }

  private async authenticateTeamFounderUser(teamFounderUserEmail: TeamFounderUserEmail, teamFounderUserPassword: TeamFounderUserPassword): Promise<Nullable<TeamFounderUser>> {
    const user = await this.#teamFounderUserRepository.searchByEmail(teamFounderUserEmail);
    if (user === null || user === undefined) {
      return null;
    }

    const isPasswordValid = await this.#passwordValidationService.validate(teamFounderUserPassword, user.password);
    return isPasswordValid ? user : null;
  }
}
