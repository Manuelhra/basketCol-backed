import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IPlayerUserRepository,
  PasswordValueObjectCreationService,
  PlayerUserNicknameValidationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressCreatePlayerUserPOSTController } from '../../server/express/controllers/ExpressCreatePlayerUserPOSTController';
import { ExpressPlayerUserServerErrorHandler } from '../../server/express/ExpressPlayerUserServerErrorHandler';
import { IPlayerUserContainer } from '../IPlayerUserContainer';
import { ICreatePlayerUserUseCase } from '../../../application/use-cases/ports/ICreatePlayerUserUseCase';
import { CreatePlayerUserUseCase } from '../../../application/use-cases/CreatePlayerUserUseCase';
import { MongoosePlayerUserRepository } from '../../persistence/mongoose/MongoosePlayerUserRepository';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ExpressPlayerUserRouteManager } from '../../server/express/routes/ExpressPlayerUserRouteManager';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { GlobFileSystem } from '../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';

export class AwilixPlayerUserDependencyInjector extends AwilixDependencyInjector<IPlayerUserContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      playerUserRouteManager: AwilixDependencyInjector.registerAsClass<IRouteManager>(ExpressPlayerUserRouteManager).singleton(),
      basePath: AwilixDependencyInjector.registerAsValue<string>(__dirname),
      fileSystem: AwilixDependencyInjector.registerAsClass<IFileSystem>(GlobFileSystem).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      playerUserServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressPlayerUserServerErrorHandler).singleton(),
      createPlayerUserPOSTController: AwilixDependencyInjector.registerAsClass<IController>(ExpressCreatePlayerUserPOSTController).singleton(),
      businessDateService: AwilixDependencyInjector.registerAsClass<BusinessDateService>(BusinessDateService).singleton(),
      createPlayerUserUseCase: AwilixDependencyInjector.registerAsClass<ICreatePlayerUserUseCase>(CreatePlayerUserUseCase).singleton(),
      emailUniquenessValidatorService: AwilixDependencyInjector.registerAsClass<EmailUniquenessValidatorService>(EmailUniquenessValidatorService).singleton(),
      idUniquenessValidatorService: AwilixDependencyInjector.registerAsClass<IdUniquenessValidatorService>(IdUniquenessValidatorService).singleton(),
      playerUserNicknameValidationService: AwilixDependencyInjector.registerAsClass<PlayerUserNicknameValidationService>(PlayerUserNicknameValidationService).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsClass<IPlayerUserRepository>(MongoosePlayerUserRepository).singleton(),
      repository: AwilixDependencyInjector.registerAsClass<IPlayerUserRepository>(MongoosePlayerUserRepository).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsClass<IPasswordHashingService>(BcryptPasswordHashingService).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsClass<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsClass<SecurePasswordCreationService>(SecurePasswordCreationService).singleton(),
    });
  }
}
