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
import { IProfileImageUploader } from '../../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { S3ProfileImageUploader } from '../../../../shared/infrastructure/file-upload/images/aws/S3ProfileImageUploader';

export class AwilixHostUserDependencyInjector extends AwilixDependencyInjector<IHostUserContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      createHostUserUseCase: AwilixDependencyInjector.registerAsFunction<CreateHostUserUseCase>(CreateHostUserUseCase.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      hostUserConfigFactory: AwilixDependencyInjector.registerAsFunction<IHostUserConfigFactory>(HostUserConfigFactory.create).singleton(),
      createHostUserPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateHostUserPOSTController.create).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsFunction<IHostUserRepository>(MongooseHostUserRepository.create).singleton(),
      hostUserRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressHostUserRouteManager.create).singleton(),
      hostUserServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressHostUserServerErrorHandler.create).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      profileImageUploader: AwilixDependencyInjector.registerAsFunction<IProfileImageUploader>(() => S3ProfileImageUploader.create({
        folderPath: 'host',
      })).singleton(),
    });
  }

  public static create(): AwilixHostUserDependencyInjector {
    return new AwilixHostUserDependencyInjector();
  }
}
