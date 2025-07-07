import {
  IHostUserRepository,
  ILeagueFounderUserRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserRepository,
  IRefereeUserRepository,
  ITeamFounderUserRepository,
  PasswordValueObjectCreationDomainService,
  SecurePasswordCreationDomainService,
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
import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
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
import { IGetAuthenticatedUserUseCase } from '../../../application/use-cases/ports/IGetAuthenticatedUserUseCase';
import { GetAuthenticatedUserUseCase } from '../../../application/use-cases/GetAuthenticatedUserUseCase';
import { ExpressGetAuthenticatedUserGETController } from '../../server/express/controllers/ExpressGetAuthenticatedUserGETController';
import { ExpressRequestPasswordResetPOSTController } from '../../server/express/controllers/ExpressRequestPasswordResetPOSTController';

export class AwilixAuthenticationDependencyInjector extends AwilixDependencyInjector<IAuthenticationContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      authenticationServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressAuthenticationServerErrorHandler.create).singleton(),
      authenticateUserPOSTController: AwilixAuthenticationDependencyInjector.registerAsFunction<IController>(ExpressAuthenticateUserPOSTController.create).singleton(),
      getAuthenticatedUserGETController: AwilixAuthenticationDependencyInjector.registerAsFunction<IController>(ExpressGetAuthenticatedUserGETController.create).singleton(),
      authenticateUserUseCase: AwilixDependencyInjector.registerAsFunction<IAuthenticateUserUseCase>(AuthenticateUserUseCase.create).singleton(),
      getAuthenticatedUserUseCase: AwilixDependencyInjector.registerAsFunction<IGetAuthenticatedUserUseCase>(GetAuthenticatedUserUseCase.create).singleton(),
      authenticationRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressAuthenticationRouteManager.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsFunction<IHostUserRepository>(MongooseHostUserRepository.create).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueFounderUserRepository: AwilixDependencyInjector.registerAsFunction<ILeagueFounderUserRepository>(MongooseLeagueFounderUserRepository.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValidationService: AwilixDependencyInjector.registerAsFunction<PasswordValidationService>(PasswordValidationService.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      refereeUserRepository: AwilixDependencyInjector.registerAsFunction<IRefereeUserRepository>(MongooseRefereeUserRepository.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      teamFounderUserRepository: AwilixDependencyInjector.registerAsFunction<ITeamFounderUserRepository>(MongooseTeamFounderUserRepository.create).singleton(),
      tokenGeneratorService: AwilixDependencyInjector.registerAsFunction<ITokenGeneratorService>(JwtTokenGeneratorService.create).singleton(),
      validateAndRefreshAuthenticationTokenPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressValidateAndRefreshAuthenticationTokenPOSTController.create).singleton(),
      validateAndRefreshAuthenticationTokenUseCase: AwilixAuthenticationDependencyInjector.registerAsFunction<IValidateAndRefreshAuthenticationTokenUseCase>(ValidateAndRefreshAuthenticationTokenUseCase.create).singleton(),
      tokenValidatorService: AwilixDependencyInjector.registerAsFunction<ITokenValidatorService>(JwtTokenValidatorService.create).singleton(),
      requestPasswordResetPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressRequestPasswordResetPOSTController.create).singleton(),
    });
  }

  public static create(): AwilixAuthenticationDependencyInjector {
    return new AwilixAuthenticationDependencyInjector();
  }
}
