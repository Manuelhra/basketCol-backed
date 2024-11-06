import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IIdUniquenessValidatorServiceRepository,
  ILeagueFounderUserRepository,
  ILeagueRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  LeagueFounderUserValidationService,
  LeagueValidationNameService,
  PasswordValueObjectCreationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { CreateLeagueUseCase } from '../../../application/use-cases/CreateLeagueUseCase';
import { ICreateLeagueUseCase } from '../../../application/use-cases/ports/ICreateLeagueUseCase';
import { ExpressCreateLeaguePOSTController } from '../../server/express/controllers/ExpressCreateLeaguePOSTController';
import { ExpressLeagueServerErrorHandler } from '../../server/express/ExpressLeagueServerErrorHandler';
import { ILeagueContainer } from '../ILeagueContainer';
import { MongooseLeagueRepository } from '../../persistence/mongoose/MongooseLeagueRepository';
import { MongooseLeagueFounderUserRepository } from '../../../../../users/league-founder/infrastructure/persistence/mongoose/MongooseLeagueFounderUserRepository';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { ExpressLeagueRouteManager } from '../../server/express/routes/ExpressLeagueRouteManager';
import { GlobFileSystem } from '../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';

export class AwilixLeagueDependencyInjector extends AwilixDependencyInjector<ILeagueContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      leagueRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressLeagueRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueServerErrorHandler.create).singleton(),
      createLeaguePOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateLeaguePOSTController.create).singleton(),
      createLeagueUseCase: AwilixDependencyInjector.registerAsFunction<ICreateLeagueUseCase>((cradle: ILeagueContainer) => CreateLeagueUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.leagueRepository as IIdUniquenessValidatorServiceRepository,
        }),
        leagueRepository: cradle.leagueRepository,
        businessDateService: cradle.businessDateService,
        leagueFounderUserValidationService: cradle.leagueFounderUserValidationService,
        leagueValidationNameService: cradle.leagueValidationNameService,
      })),
      leagueRepository: AwilixDependencyInjector.registerAsFunction<ILeagueRepository>(MongooseLeagueRepository.create).singleton(),
      leagueFounderUserRepository: AwilixDependencyInjector.registerAsFunction<ILeagueFounderUserRepository>(MongooseLeagueFounderUserRepository.create).singleton(),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      leagueFounderUserValidationService: AwilixDependencyInjector.registerAsFunction<LeagueFounderUserValidationService>(LeagueFounderUserValidationService.create).singleton(),
      leagueValidationNameService: AwilixDependencyInjector.registerAsFunction<LeagueValidationNameService>(LeagueValidationNameService.create).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
    });
  }

  public static create(): AwilixLeagueDependencyInjector {
    return new AwilixLeagueDependencyInjector();
  }
}
