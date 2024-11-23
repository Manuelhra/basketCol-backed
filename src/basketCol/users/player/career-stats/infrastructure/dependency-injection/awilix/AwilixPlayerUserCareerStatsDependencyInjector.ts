import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserCareerStatsRepository,
  IPlayerUserRepository,
  PasswordValueObjectCreationDomainService,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
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
import { ExpressFindCareerStatsByPlayerUserIdGETController } from '../../server/express/controllers/ExpressFindCareerStatsByPlayerUserIdGETController';
import { IFindCareerStatsByPlayerUserIdUseCase } from '../../../application/use-cases/ports/IFindCareerStatsByPlayerUserIdUseCase';
import { FindCareerStatsByPlayerUserIdUseCase } from '../../../application/use-cases/FindCareerStatsByPlayerUserIdUseCase';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { HttpResponseHandler } from '../../../../../../shared/infrastructure/http/HttpResponseHandler';

export class AwilixPlayerUserCareerStatsDependencyInjector
  extends AwilixDependencyInjector<IPlayerUserCareerStatsContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      createPlayerUserCareerStatsPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreatePlayerUserCareerStatsPOSTController.create).singleton(),
      createPlayerUserCareerStatsUseCase: AwilixDependencyInjector.registerAsFunction<ICreatePlayerUserCareerStatsUseCase>(CreatePlayerUserCareerStatsUseCase.create),
      idUniquenessValidatorDomainService: AwilixDependencyInjector.registerAsFunction<IdUniquenessValidatorDomainService>(IdUniquenessValidatorDomainService.create).singleton(),
      idUniquenessValidatorDomainServiceRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserCareerStatsRepository>(MongoosePlayerUserCareerStatsRepository.create).singleton(),
      playerUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<PlayerUserValidationDomainService>(PlayerUserValidationDomainService.create).singleton(),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      playerUserCareerStatsRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserCareerStatsRepository>(MongoosePlayerUserCareerStatsRepository.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      playerUserCareerStatsRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressPlayerUserCareerStatsRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      findCareerStatsByPlayerUserIdGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressFindCareerStatsByPlayerUserIdGETController.create).singleton(),
      findCareerStatsByPlayerUserIdUseCase: AwilixDependencyInjector.registerAsFunction<IFindCareerStatsByPlayerUserIdUseCase>(FindCareerStatsByPlayerUserIdUseCase.create).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
    });
  }

  public static create(): AwilixPlayerUserCareerStatsDependencyInjector {
    return new AwilixPlayerUserCareerStatsDependencyInjector();
  }
}
