import {
  BusinessDateService,
  CreatePasswordValueObjectService,
  ICreatePasswordValueObjectService,
  IHostUserRepository,
  IPasswordEncrypterService,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Mongoose, Schema } from 'mongoose';

import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { IHostUserContainer } from '../IHostUserContainer';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ExpressHostUserRouteManager } from '../../server/express/routes/ExpressHostUserRouteManager';
import { CreateHostUserUseCase } from '../../../application/use-cases/CreateHostUserUseCase';
import { MongooseHostUserRepository } from '../../persistence/mongoose/MongooseHostUserRepository';
import { BcryptPasswordEncrypter } from '../../../../../shared/infrastructure/services/BcryptPasswordEncrypter';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { IMongooseHostUserDocument } from '../../persistence/mongoose/IMongooseHostUserDocument';
import { mongooseHostUserSchema } from '../../persistence/mongoose/mongoose-host-user.schema';
import { ExpressCreateHostUserPOSTController } from '../../server/express/controllers/ExpressCreateHostUserPOSTController';
import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressHostUserServerErrorHandler } from '../../server/express/ExpressHostUserServerErrorHandler';

export class AwilixHostUserDependencyInjector extends AwilixDependencyInjector<IHostUserContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      basePath: AwilixDependencyInjector.registerAsValue<string>(__dirname),
      businessDateService: AwilixDependencyInjector.registerAsClass<BusinessDateService>(BusinessDateService).singleton(),
      createHostUserUseCase: AwilixDependencyInjector.registerAsClass<CreateHostUserUseCase>(CreateHostUserUseCase).singleton(),
      createPasswordValueObjectService: AwilixDependencyInjector.registerAsClass<ICreatePasswordValueObjectService>(CreatePasswordValueObjectService).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsClass<IFileSystem>(GlobFileSystem).singleton(),
      hostUserMongooseSchema: AwilixDependencyInjector.registerAsValue<Schema<IMongooseHostUserDocument>>(mongooseHostUserSchema),
      createHostUserPOSTController: AwilixDependencyInjector.registerAsClass<IController>(ExpressCreateHostUserPOSTController).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsClass<IHostUserRepository>(MongooseHostUserRepository).singleton(),
      hostUserRouteManager: AwilixDependencyInjector.registerAsClass<IRouteManager>(ExpressHostUserRouteManager).singleton(),
      hostUserServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressHostUserServerErrorHandler).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      mongooseClient: AwilixDependencyInjector.registerAsFunction<Promise<Mongoose>>(MongooseClientFactory.createMongooseClient).singleton(),
      passwordEncrypterService: AwilixDependencyInjector.registerAsClass<IPasswordEncrypterService>(BcryptPasswordEncrypter).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsClass<SecurePasswordCreationService>(SecurePasswordCreationService).singleton(),
    });
  }
}
