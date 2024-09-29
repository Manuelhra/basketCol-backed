import {
  IHostUserRepository,
  ILeagueFounderUserRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IPlayerUserRepository,
  IRefereeUserRepository,
  ITeamFounderUserRepository,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IAuthenticateUserUseCase } from '../../application/use-cases/ports/IAuthenticateUserUseCase';
import { PasswordValidationService } from '../../application/services/PasswordValidationService';
import { ITokenGeneratorService } from '../../application/services/ITokenGeneratorService';
import { IController } from '../../../shared/infrastructure/server/controllers/IController';
import { IHttpResponseHandler } from '../../../shared/application/http/ports/IHttpResponseHandler';
import { IRouteManager } from '../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../shared/infrastructure/file-system/IFileSystem';
import { IServerErrorHandler } from '../../../shared/infrastructure/server/IServerErrorHandler';
import { IValidateAndRefreshAuthenticationTokenUseCase } from '../../application/use-cases/ports/IValidateAndRefreshAuthenticationTokenUseCase';
import { ITokenValidatorService } from '../../application/services/ITokenValidatorService';

export interface IAuthenticationContainer {
  authenticationServerErrorHandler: IServerErrorHandler;
  authenticateUserPOSTController: IController;
  authenticateUserUseCase: IAuthenticateUserUseCase;
  authenticationRouteManager: IRouteManager;
  basePath: string;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  fileSystem: IFileSystem;
  hostUserRepository: IHostUserRepository;
  httpResponseHandler: IHttpResponseHandler;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
  passwordHashingService: IPasswordHashingService;
  passwordValidationService: PasswordValidationService;
  playerUserRepository: IPlayerUserRepository;
  refereeUserRepository: IRefereeUserRepository;
  securePasswordCreationService: SecurePasswordCreationService;
  teamFounderUserRepository: ITeamFounderUserRepository;
  tokenGeneratorService: ITokenGeneratorService;
  validateAndRefreshAuthenticationTokenPOSTController: IController;
  validateAndRefreshAuthenticationTokenUseCase:IValidateAndRefreshAuthenticationTokenUseCase;
  tokenValidatorService: ITokenValidatorService;
}
