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

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
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
import { IProfileImageUploader } from '../../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { S3ProfileImageUploader } from '../../../../shared/infrastructure/file-upload/images/aws/S3ProfileImageUploader';
import { ISearchPlayerUsersUseCase } from '../../../application/use-cases/ports/ISearchPlayerUsersUseCase';
import { SearchPlayerUsersUseCase } from '../../../application/use-cases/SearchPlayerUsersUseCase';
import { ExpressSearchPlayerUsersGETController } from '../../server/express/controllers/ExpressSearchPlayerUsersGETController';

export class AwilixPlayerUserDependencyInjector
  extends AwilixDependencyInjector<IPlayerUserContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      playerUserRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressPlayerUserRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      playerUserServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressPlayerUserServerErrorHandler.create).singleton(),
      createPlayerUserPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreatePlayerUserPOSTController.create).singleton(),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      createPlayerUserUseCase: AwilixDependencyInjector.registerAsFunction<ICreatePlayerUserUseCase>(CreatePlayerUserUseCase.create).singleton(),
      emailUniquenessValidatorService: AwilixDependencyInjector.registerAsFunction<EmailUniquenessValidatorService>(EmailUniquenessValidatorService.create).singleton(),
      emailUniquenessValidatorServiceRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      idUniquenessValidatorService: AwilixDependencyInjector.registerAsFunction<IdUniquenessValidatorService>(IdUniquenessValidatorService.create).singleton(),
      playerUserNicknameValidationService: AwilixDependencyInjector.registerAsFunction<PlayerUserNicknameValidationService>(PlayerUserNicknameValidationService.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      idUniquenessValidatorServiceRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      profileImageUploader: AwilixDependencyInjector.registerAsFunction<IProfileImageUploader>(() => S3ProfileImageUploader.create({
        folderPath: 'player',
      })).singleton(),
      searchPlayerUsersGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressSearchPlayerUsersGETController.create).singleton(),
      searchPlayerUsersUseCase: AwilixDependencyInjector.registerAsFunction<ISearchPlayerUsersUseCase>(SearchPlayerUsersUseCase.create).singleton(),
    });
  }

  public static create(): AwilixPlayerUserDependencyInjector {
    return new AwilixPlayerUserDependencyInjector();
  }
}
