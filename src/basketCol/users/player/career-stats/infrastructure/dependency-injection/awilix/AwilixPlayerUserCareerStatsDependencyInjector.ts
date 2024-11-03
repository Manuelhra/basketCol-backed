import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IPlayerUserCareerStatsRepository,
  IPlayerUserRepository,
  PasswordValueObjectCreationService,
  PlayerUserValidationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { AwilixDependencyInjector } from '../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { IController } from '../../../../../../shared/infrastructure/server/controllers/IController';
import { CreatePlayerUserCareerStatsUseCase } from '../../../application/use-cases/CreatePlayerUserCareerStatsUseCase';
import { ICreatePlayerUserCareerStatsUseCase } from '../../../application/use-cases/ports/ICreatePlayerUserCareerStatsUseCase';
import { ExpressCreatePlayerUserCareerStatsPOSTController } from '../../server/express/controllers/ExpressCreatePlayerUserCareerStatsPOSTController';
import { IPlayerUserCareerStatsContainer } from '../IPlayerUserCareerStatsContainer';
import { MongoosePlayerUserCareerStatsRepository } from '../../persistence/mongoose/MongoosePlayerUserCareerStatsRepository';
import { MongoosePlayerUserRepository } from '../../../../infrastructure/persistence/mongoose/MongoosePlayerUserRepository';
import { BcryptPasswordHashingService } from '../../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ExpressPlayerUserCareerStatsRouteManager } from '../../server/express/routes/ExpressPlayerUserCareerStatsRouteManager';
import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { GlobFileSystem } from '../../../../../../shared/infrastructure/file-system/GlobFileSystem';

export class AwilixPlayerUserCareerStatsDependencyInjector
  extends AwilixDependencyInjector<IPlayerUserCareerStatsContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      createPlayerUserCareerStatsPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreatePlayerUserCareerStatsPOSTController.create).singleton(),
      createPlayerUserCareerStatsUseCase: AwilixDependencyInjector.registerAsFunction<ICreatePlayerUserCareerStatsUseCase>(CreatePlayerUserCareerStatsUseCase.create),
      idUniquenessValidatorService: AwilixDependencyInjector.registerAsFunction<IdUniquenessValidatorService>(IdUniquenessValidatorService.create).singleton(),
      idUniquenessValidatorServiceRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserCareerStatsRepository>(MongoosePlayerUserCareerStatsRepository.create).singleton(),
      playerUserValidationService: AwilixDependencyInjector.registerAsFunction<PlayerUserValidationService>(PlayerUserValidationService.create).singleton(),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      playerUserCareerStatsRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserCareerStatsRepository>(MongoosePlayerUserCareerStatsRepository.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
      playerUserCareerStatsRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressPlayerUserCareerStatsRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
    });
  }

  public static create(): AwilixPlayerUserCareerStatsDependencyInjector {
    return new AwilixPlayerUserCareerStatsDependencyInjector();
  }
}
