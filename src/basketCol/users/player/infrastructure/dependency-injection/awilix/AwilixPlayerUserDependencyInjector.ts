import {
  BusinessDateDomainService,
  EmailUniquenessValidatorDomainService,
  IdUniquenessValidatorDomainService,
  IEmailUniquenessValidatorDomainServiceRepository,
  IIdUniquenessValidatorDomainServiceRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserCareerStatsRepository,
  IPlayerUserRepository,
  PasswordValueObjectCreationDomainService,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
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
import { ExpressFindPlayerUserByIdGETController } from '../../server/express/controllers/ExpressFindPlayerUserByIdGETController';
import { IFindPlayerUserByIdUseCase } from '../../../application/use-cases/ports/IFindPlayerUserByIdUseCase';
import { FindPlayerUserByIdUseCase } from '../../../application/use-cases/FindPlayerUserByIdUseCase';

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
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      createPlayerUserUseCase: AwilixDependencyInjector.registerAsFunction<ICreatePlayerUserUseCase>((cradle: IPlayerUserContainer) => CreatePlayerUserUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.playerUserRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        emailUniquenessValidatorDomainService: EmailUniquenessValidatorDomainService.create({
          emailUniquenessValidatorDomainServiceRepository: cradle.playerUserRepository as IEmailUniquenessValidatorDomainServiceRepository,
        }),
        createPlayerUserCareerStatsUseCase: cradle.createPlayerUserCareerStatsUseCase,
        playerUserRepository: cradle.playerUserRepository,
        uuidGenerator: cradle.uuidGenerator,
        playerUserValidationDomainService: cradle.playerUserValidationDomainService,
      })).singleton(),
      playerUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<PlayerUserValidationDomainService>(PlayerUserValidationDomainService.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      profileImageUploader: AwilixDependencyInjector.registerAsFunction<IProfileImageUploader>(() => S3ProfileImageUploader.create({
        folderPath: 'player',
      })).singleton(),
      searchAllPlayerUsersGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressSearchAllPlayerUsersGETController.create).singleton(),
      searchAllPlayerUsersUseCase: AwilixDependencyInjector.registerAsFunction<ISearchAllPlayerUsersUseCase>(SearchAllPlayerUsersUseCase.create).singleton(),
      createPlayerUserCareerStatsUseCase: AwilixDependencyInjector.registerAsFunction<ICreatePlayerUserCareerStatsUseCase>((cradle: IPlayerUserContainer) => CreatePlayerUserCareerStatsUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.playerUserCareerStatsRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        playerUserCareerStatsRepository: cradle.playerUserCareerStatsRepository,
        playerUserValidationDomainService: PlayerUserValidationDomainService.create({
          playerUserRepository: cradle.playerUserRepository,
        }),
      })),
      playerUserCareerStatsRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserCareerStatsRepository>(MongoosePlayerUserCareerStatsRepository.create).singleton(),
      uuidGenerator: AwilixDependencyInjector.registerAsFunction<IUuidGenerator>(UuidV4Generator.create).singleton(),
      findPlayerUserByIdGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressFindPlayerUserByIdGETController.create).singleton(),
      findPlayerUserByIdUseCase: AwilixDependencyInjector.registerAsFunction<IFindPlayerUserByIdUseCase>(FindPlayerUserByIdUseCase.create).singleton(),
    });
  }

  public static create(): AwilixPlayerUserDependencyInjector {
    return new AwilixPlayerUserDependencyInjector();
  }
}
