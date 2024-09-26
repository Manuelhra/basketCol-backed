import {
  IHostUserRepository,
  ILeagueFounderUserRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IPlayerUserRepository,
  IRefereeUserRepository,
  ITeamFounderUserRepository,
  PasswordValueObjectCreationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { AwilixDependencyInjector } from '../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { AuthenticateUserUseCase } from '../../../application/use-cases/AuthenticateUserUseCase';
import { IAuthenticateUserUseCase } from '../../../application/use-cases/ports/IAuthenticateUserUseCase';
import { IAuthenticationContainer } from '../IAuthenticationContainer';
import { MongoosePlayerUserRepository } from '../../../../users/player/infrastructure/persistence/mongoose/MongoosePlayerUserRepository';
import { MongooseHostUserRepository } from '../../../../users/host/infrastructure/persistence/mongoose/MongooseHostUserRepository';
import { MongooseRefereeUserRepository } from '../../../../users/referee/infrastructure/persistence/mongoose/MongooseRefereeUserRepository';
import { MongooseTeamFounderUserRepository } from '../../../../users/team-founder/infrastructure/persistence/mongoose/MongooseTeamFounderUserRepository';
import { PasswordValidationService } from '../../../application/services/PasswordValidationService';
import { ITokenGeneratorService } from '../../../application/services/ITokenGeneratorService';
import { JwtTokenGeneratorService } from '../../services/jwt/JwtTokenGeneratorService';
import { MongooseLeagueFounderUserRepository } from '../../../../users/league-founder/infrastructure/persistence/mongoose/MongooseLeagueFounderUserRepository';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { ExpressAuthenticateUserPOSTController } from '../../server/express/controllers/ExpressAuthenticateUserPOSTController';
import { IHttpResponseHandler } from '../../../../shared/application/http/IHttpResponseHandler';
import { HttpResponseHandler } from '../../../../shared/infrastructure/http/HttpResponseHandler';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { ExpressAuthenticationRouteManager } from '../../server/express/routes/ExpressAuthenticationRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { GlobFileSystem } from '../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressAuthenticationServerErrorHandler } from '../../server/express/ExpressAuthenticationServerErrorHandler';
import { BcryptPasswordHashingService } from '../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { ExpressValidateAndRefreshAuthenticationTokenPOSTController } from '../../server/express/controllers/ExpressValidateAndRefreshAuthenticationTokenPOSTController';
import { ValidateAndRefreshAuthenticationTokenUseCase } from '../../../application/use-cases/ValidateAndRefreshAuthenticationTokenUseCase';
import { IValidateAndRefreshAuthenticationTokenUseCase } from '../../../application/use-cases/ports/IValidateAndRefreshAuthenticationTokenUseCase';
import { ITokenValidatorService } from '../../../application/services/ITokenValidatorService';
import { JwtTokenValidatorService } from '../../services/jwt/JwtTokenValidatorService';

export class AwilixAuthenticationDependencyInjector extends AwilixDependencyInjector<IAuthenticationContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      authenticationServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressAuthenticationServerErrorHandler).singleton(),
      authenticateUserPOSTController: AwilixAuthenticationDependencyInjector.registerAsClass<IController>(ExpressAuthenticateUserPOSTController).singleton(),
      authenticateUserUseCase: AwilixDependencyInjector.registerAsClass<IAuthenticateUserUseCase>(AuthenticateUserUseCase).singleton(),
      authenticationRouteManager: AwilixDependencyInjector.registerAsClass<IRouteManager>(ExpressAuthenticationRouteManager).singleton(),
      basePath: AwilixDependencyInjector.registerAsValue<string>(__dirname),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsClass<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsClass<IFileSystem>(GlobFileSystem).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsClass<IHostUserRepository>(MongooseHostUserRepository).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      leagueFounderUserRepository: AwilixDependencyInjector.registerAsClass<ILeagueFounderUserRepository>(MongooseLeagueFounderUserRepository).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsClass<IPasswordHashingService>(BcryptPasswordHashingService).singleton(),
      passwordValidationService: AwilixDependencyInjector.registerAsClass<PasswordValidationService>(PasswordValidationService).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsClass<IPlayerUserRepository>(MongoosePlayerUserRepository).singleton(),
      refereeUserRepository: AwilixDependencyInjector.registerAsClass<IRefereeUserRepository>(MongooseRefereeUserRepository).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsClass<SecurePasswordCreationService>(SecurePasswordCreationService).singleton(),
      teamFounderUserRepository: AwilixDependencyInjector.registerAsClass<ITeamFounderUserRepository>(MongooseTeamFounderUserRepository).singleton(),
      tokenGeneratorService: AwilixDependencyInjector.registerAsClass<ITokenGeneratorService>(JwtTokenGeneratorService).singleton(),
      validateAndRefreshAuthenticationTokenPOSTController: AwilixDependencyInjector.registerAsClass<IController>(ExpressValidateAndRefreshAuthenticationTokenPOSTController).singleton(),
      validateAndRefreshAuthenticationTokenUseCase: AwilixAuthenticationDependencyInjector.registerAsClass<IValidateAndRefreshAuthenticationTokenUseCase>(ValidateAndRefreshAuthenticationTokenUseCase).singleton(),
      tokenValidatorService: AwilixDependencyInjector.registerAsClass<ITokenValidatorService>(JwtTokenValidatorService).singleton(),
    });
  }
}
