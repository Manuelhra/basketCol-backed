import {
  CreatePasswordValueObjectService,
  ICreatePasswordValueObjectService,
  IHostUserRepository,
  ILeagueFounderUserRepository,
  IPasswordEncrypterService,
  IPlayerUserRepository,
  IRefereeUserRepository,
  ITeamFounderUserRepository,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Mongoose, Schema } from 'mongoose';

import { AwilixDependencyInjector } from '../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { AuthenticateUserUseCase } from '../../../application/use-cases/AuthenticateUserUseCase';
import { IAuthenticateUserUseCase } from '../../../application/use-cases/ports/IAuthenticateUserUseCase';
import { IAuthenticationContainer } from '../IAuthenticationContainer';
import { MongoosePlayerUserRepository } from '../../../../users/player/infrastructure/persistence/mongoose/MongoosePlayerUserRepository';
import { MongooseHostUserRepository } from '../../../../users/host/infrastructure/persistence/mongoose/MongooseHostUserRepository';
import { MongooseRefereeUserRepository } from '../../../../users/referee/infrastructure/persistence/mongoose/MongooseRefereeUserRepository';
import { MongooseClientFactory } from '../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { MongooseTeamFounderUserRepository } from '../../../../users/team-founder/infrastructure/persistence/mongoose/MongooseTeamFounderUserRepository';
import { PasswordValidationService } from '../../../application/services/PasswordValidationService';
import { BcryptPasswordEncrypter } from '../../../../shared/infrastructure/services/BcryptPasswordEncrypter';
import { ITokenGeneratorService } from '../../../application/services/ITokenGeneratorService';
import { JwtTokenGeneratorService } from '../../services/jwt/JwtTokenGeneratorService';
import { IMongooseHostUserDocument } from '../../../../users/host/infrastructure/persistence/mongoose/IMongooseHostUserDocument';
import { mongooseHostUserSchema } from '../../../../users/host/infrastructure/persistence/mongoose/mongoose-host-user.schema';
import { MongooseLeagueFounderUserRepository } from '../../../../users/league-founder/infrastructure/persistence/mongoose/MongooseLeagueFounderUserRepository';
import { IMongooseLeagueFounderUserDocument } from '../../../../users/league-founder/infrastructure/persistence/mongoose/IMongooseLeagueFounderUserDocument';
import { mongooseLeagueFounderUserSchema } from '../../../../users/league-founder/infrastructure/persistence/mongoose/mongoose-league-founder-user.schema';
import { IMongoosePlayerUserDocument } from '../../../../users/player/infrastructure/persistence/mongoose/IMongoosePlayerUserDocument';
import { mongoosePlayerUserSchema } from '../../../../users/player/infrastructure/persistence/mongoose/mongoose-player-user.schema';
import { IMongooseRefereeUserDocument } from '../../../../users/referee/infrastructure/persistence/mongoose/IMongooseRefereeUserDocument';
import { mongooseRefereeUserSchema } from '../../../../users/referee/infrastructure/persistence/mongoose/mongoose-referee-user.schema';
import { IMongooseTeamFounderUserDocument } from '../../../../users/team-founder/infrastructure/persistence/mongoose/IMongooseTeamFounderUserDocument';
import { mongooseTeamFounderUserSchema } from '../../../../users/team-founder/infrastructure/persistence/mongoose/mongoose-team-founder-user.schema';
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
      createPasswordValueObjectService: AwilixDependencyInjector.registerAsClass<ICreatePasswordValueObjectService>(CreatePasswordValueObjectService).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsClass<IFileSystem>(GlobFileSystem).singleton(),
      hostUserMongooseSchema: AwilixDependencyInjector.registerAsValue<Schema<IMongooseHostUserDocument>>(mongooseHostUserSchema),
      hostUserRepository: AwilixDependencyInjector.registerAsClass<IHostUserRepository>(MongooseHostUserRepository).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      leagueFounderUserMongooseSchema: AwilixDependencyInjector.registerAsValue<Schema<IMongooseLeagueFounderUserDocument>>(mongooseLeagueFounderUserSchema),
      leagueFounderUserRepository: AwilixDependencyInjector.registerAsClass<ILeagueFounderUserRepository>(MongooseLeagueFounderUserRepository).singleton(),
      mongooseClient: AwilixDependencyInjector.registerAsFunction<Promise<Mongoose>>(MongooseClientFactory.createMongooseClient).singleton(),
      passwordEncrypterService: AwilixDependencyInjector.registerAsClass<IPasswordEncrypterService>(BcryptPasswordEncrypter).singleton(),
      passwordValidationService: AwilixDependencyInjector.registerAsClass<PasswordValidationService>(PasswordValidationService).singleton(),
      playerUserMongooseSchema: AwilixDependencyInjector.registerAsValue<Schema<IMongoosePlayerUserDocument>>(mongoosePlayerUserSchema),
      playerUserRepository: AwilixDependencyInjector.registerAsClass<IPlayerUserRepository>(MongoosePlayerUserRepository).singleton(),
      refereeUserMongooseSchema: AwilixDependencyInjector.registerAsValue<Schema<IMongooseRefereeUserDocument>>(mongooseRefereeUserSchema),
      refereeUserRepository: AwilixDependencyInjector.registerAsClass<IRefereeUserRepository>(MongooseRefereeUserRepository).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsClass<SecurePasswordCreationService>(SecurePasswordCreationService).singleton(),
      teamFounderUserMongooseSchema: AwilixDependencyInjector.registerAsValue<Schema<IMongooseTeamFounderUserDocument>>(mongooseTeamFounderUserSchema),
      teamFounderUserRepository: AwilixDependencyInjector.registerAsClass<ITeamFounderUserRepository>(MongooseTeamFounderUserRepository).singleton(),
      tokenGeneratorService: AwilixDependencyInjector.registerAsClass<ITokenGeneratorService>(JwtTokenGeneratorService).singleton(),
    });
  }
}
