import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  IEmailUniquenessValidatorServiceRepository,
  IIdUniquenessValidatorServiceRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IPlayerUserCareerStatsRepository,
  IPlayerUserRepository,
  PasswordValueObjectCreationService,
  PlayerUserNicknameValidationService,
  PlayerUserValidationService,
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
import { ISearchAllPlayerUsersUseCase } from '../../../application/use-cases/ports/ISearchAllPlayerUsersUseCase';
import { SearchAllPlayerUsersUseCase } from '../../../application/use-cases/SearchAllPlayerUsersUseCase';
import { ExpressSearchAllPlayerUsersGETController } from '../../server/express/controllers/ExpressSearchAllPlayerUsersGETController';
import { ICreatePlayerUserCareerStatsUseCase } from '../../../career-stats/application/use-cases/ports/ICreatePlayerUserCareerStatsUseCase';
import { CreatePlayerUserCareerStatsUseCase } from '../../../career-stats/application/use-cases/CreatePlayerUserCareerStatsUseCase';
import { MongoosePlayerUserCareerStatsRepository } from '../../../career-stats/infrastructure/persistence/mongoose/MongoosePlayerUserCareerStatsRepository';
import { IUuidGenerator } from '../../../../../shared/application/uuid/ports/IUuidGenerator';
import { UuidV4Generator } from '../../../../../shared/infrastructure/uuid/UuidV4Generator';

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
      createPlayerUserUseCase: AwilixDependencyInjector.registerAsFunction<ICreatePlayerUserUseCase>((cradle: IPlayerUserContainer) => CreatePlayerUserUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.playerUserRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        emailUniquenessValidatorService: EmailUniquenessValidatorService.create({
          emailUniquenessValidatorServiceRepository: cradle.playerUserRepository as IEmailUniquenessValidatorServiceRepository,
        }),
        playerUserNicknameValidationService: cradle.playerUserNicknameValidationService,
        createPlayerUserCareerStatsUseCase: cradle.createPlayerUserCareerStatsUseCase,
        playerUserRepository: cradle.playerUserRepository,
        uuidGenerator: cradle.uuidGenerator,
      })).singleton(),
      playerUserNicknameValidationService: AwilixDependencyInjector.registerAsFunction<PlayerUserNicknameValidationService>(PlayerUserNicknameValidationService.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      profileImageUploader: AwilixDependencyInjector.registerAsFunction<IProfileImageUploader>(() => S3ProfileImageUploader.create({
        folderPath: 'player',
      })).singleton(),
      searchAllPlayerUsersGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressSearchAllPlayerUsersGETController.create).singleton(),
      searchAllPlayerUsersUseCase: AwilixDependencyInjector.registerAsFunction<ISearchAllPlayerUsersUseCase>(SearchAllPlayerUsersUseCase.create).singleton(),
      createPlayerUserCareerStatsUseCase: AwilixDependencyInjector.registerAsFunction<ICreatePlayerUserCareerStatsUseCase>((cradle: IPlayerUserContainer) => CreatePlayerUserCareerStatsUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.playerUserCareerStatsRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        playerUserCareerStatsRepository: cradle.playerUserCareerStatsRepository,
        playerUserValidationService: PlayerUserValidationService.create({
          playerUserRepository: cradle.playerUserRepository,
        }),
      })),
      playerUserCareerStatsRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserCareerStatsRepository>(MongoosePlayerUserCareerStatsRepository.create).singleton(),
      uuidGenerator: AwilixDependencyInjector.registerAsFunction<IUuidGenerator>(UuidV4Generator.create).singleton(),
    });
  }

  public static create(): AwilixPlayerUserDependencyInjector {
    return new AwilixPlayerUserDependencyInjector();
  }
}
