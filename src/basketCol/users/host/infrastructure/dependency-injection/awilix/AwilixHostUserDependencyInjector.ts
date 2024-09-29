import {
  BusinessDateService,
  IHostUserRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  PasswordValueObjectCreationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { IHostUserContainer } from '../IHostUserContainer';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ExpressHostUserRouteManager } from '../../server/express/routes/ExpressHostUserRouteManager';
import { CreateHostUserUseCase } from '../../../application/use-cases/CreateHostUserUseCase';
import { MongooseHostUserRepository } from '../../persistence/mongoose/MongooseHostUserRepository';
import { ExpressCreateHostUserPOSTController } from '../../server/express/controllers/ExpressCreateHostUserPOSTController';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressHostUserServerErrorHandler } from '../../server/express/ExpressHostUserServerErrorHandler';
import { IHostUserConfigFactory } from '../../../application/ports/IHostUserConfigFactory';
import { HostUserConfigFactory } from '../../adapters/HostUserConfigFactory';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';

export class AwilixHostUserDependencyInjector extends AwilixDependencyInjector<IHostUserContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      basePath: AwilixDependencyInjector.registerAsValue<string>(__dirname),
      businessDateService: AwilixDependencyInjector.registerAsClass<BusinessDateService>(BusinessDateService).singleton(),
      createHostUserUseCase: AwilixDependencyInjector.registerAsClass<CreateHostUserUseCase>(CreateHostUserUseCase).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsClass<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsClass<IFileSystem>(GlobFileSystem).singleton(),
      hostUserConfigFactory: AwilixDependencyInjector.registerAsClass<IHostUserConfigFactory>(HostUserConfigFactory),
      createHostUserPOSTController: AwilixDependencyInjector.registerAsClass<IController>(ExpressCreateHostUserPOSTController).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsClass<IHostUserRepository>(MongooseHostUserRepository).singleton(),
      hostUserRouteManager: AwilixDependencyInjector.registerAsClass<IRouteManager>(ExpressHostUserRouteManager).singleton(),
      hostUserServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressHostUserServerErrorHandler).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsClass<IPasswordHashingService>(BcryptPasswordHashingService).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsClass<SecurePasswordCreationService>(SecurePasswordCreationService).singleton(),
    });
  }
}
