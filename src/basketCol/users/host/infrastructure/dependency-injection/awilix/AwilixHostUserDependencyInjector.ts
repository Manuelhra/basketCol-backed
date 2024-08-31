import {
  BusinessDateService,
  CreatePasswordValueObjectService,
  ICreatePasswordValueObjectService,
  IHostUserRepository,
  IPasswordEncrypterService,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Request, Response, Router } from 'express';
import { Mongoose, Schema } from 'mongoose';

import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { ExpressHostUserPostController } from '../../server/express/controllers/ExpressHostUserPostController';
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
import { IMongooseConfig } from '../../../../../shared/infrastructure/persistence/mongoose/IMongooseConfig';
import { MongooseConfigFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseConfigFactory';

export class AwilixHostUserDependencyInjector extends AwilixDependencyInjector<IHostUserContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      basePath: AwilixDependencyInjector.registerAsValue<string>(__dirname),
      mongooseConfig: AwilixDependencyInjector.registerAsValue<IMongooseConfig>(MongooseConfigFactory.createMongooseConfig()),
      mongooseSchema: AwilixDependencyInjector.registerAsValue<Schema<IMongooseHostUserDocument>>(mongooseHostUserSchema),
      fileSystem: AwilixDependencyInjector.registerAsClass<IFileSystem>(GlobFileSystem).singleton(),
      businessDateService: AwilixDependencyInjector.registerAsClass<BusinessDateService>(BusinessDateService).singleton(),
      passwordEncrypterService: AwilixDependencyInjector.registerAsClass<IPasswordEncrypterService>(BcryptPasswordEncrypter).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsClass<SecurePasswordCreationService>(SecurePasswordCreationService).singleton(),
      mongooseClient: AwilixDependencyInjector.registerAsFunction<Promise<Mongoose>>(MongooseClientFactory.createMongooseClient).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsClass<IHostUserRepository>(MongooseHostUserRepository).singleton(),
      createHostUserUseCase: AwilixDependencyInjector.registerAsClass<CreateHostUserUseCase>(CreateHostUserUseCase).singleton(),
      createPasswordValueObjectService: AwilixDependencyInjector.registerAsClass<ICreatePasswordValueObjectService>(CreatePasswordValueObjectService).singleton(),
      expressHostUserPostController: AwilixDependencyInjector.registerAsClass<IController<Request, Response>>(ExpressHostUserPostController).singleton(),
      expressHostUserRouteManager: AwilixDependencyInjector.registerAsClass<IRouteManager<Router>>(ExpressHostUserRouteManager).singleton(),
    });
  }
}
