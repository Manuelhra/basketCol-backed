import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  ILeagueFounderUserRepository,
  ILeagueRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  LeagueFounderUserValidationDomainService,
  LeagueValidationDomainService,
  PasswordValueObjectCreationDomainService,
  SecurePasswordCreationDomainService,
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
import { ExpressSearchAllLeaguesGETController } from '../../server/express/controllers/ExpressSearchAllLeaguesGETController';
import { ISearchAllLeaguesUseCase } from '../../../application/use-cases/ports/ISearchAllLeaguesUseCase';
import { SearchAllLeaguesUseCase } from '../../../application/use-cases/SearchAllLeaguesUseCase';
import { ExpressFindLeagueByIdGETController } from '../../server/express/controllers/ExpressFindLeagueByIdGETController';
import { IFindLeagueByIdUseCase } from '../../../application/use-cases/ports/IFindLeagueByIdUseCase';
import { FindLeagueByIdUseCase } from '../../../application/use-cases/FindLeagueByIdUseCase';

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
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.leagueRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        leagueRepository: cradle.leagueRepository,
        businessDateDomainService: cradle.businessDateDomainService,
        leagueFounderUserValidationDomainService: cradle.leagueFounderUserValidationDomainService,
        leagueValidationDomainService: cradle.leagueValidationDomainService,
      })),
      leagueRepository: AwilixDependencyInjector.registerAsFunction<ILeagueRepository>(MongooseLeagueRepository.create).singleton(),
      leagueFounderUserRepository: AwilixDependencyInjector.registerAsFunction<ILeagueFounderUserRepository>(MongooseLeagueFounderUserRepository.create).singleton(),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      leagueFounderUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueFounderUserValidationDomainService>(LeagueFounderUserValidationDomainService.create).singleton(),
      leagueValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueValidationDomainService>(LeagueValidationDomainService.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      searchAllLeaguesGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressSearchAllLeaguesGETController.create).singleton(),
      searchAllLeaguesUseCase: AwilixDependencyInjector.registerAsFunction<ISearchAllLeaguesUseCase>(SearchAllLeaguesUseCase.create).singleton(),
      findLeagueByIdGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressFindLeagueByIdGETController.create).singleton(),
      findLeagueByIdUseCase: AwilixDependencyInjector.registerAsFunction<IFindLeagueByIdUseCase>(FindLeagueByIdUseCase.create).singleton(),
    });
  }

  public static create(): AwilixLeagueDependencyInjector {
    return new AwilixLeagueDependencyInjector();
  }
}
