import {
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  BusinessDateDomainService,
  ILeagueTeamRepository,
  LeagueValidationDomainService,
  ILeagueRepository,
  LeagueTeamValidationDomainService,
  ITeamRepository,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { MongooseLeagueRepository } from '../../../../infrastructure/persistence/mongoose/MongooseLeagueRepository';
import { CreateLeagueTeamUseCase } from '../../../application/use-cases/CreateLeagueTeamUseCase';
import { ICreateLeagueTeamUseCase } from '../../../application/use-cases/ports/ICreateLeagueTeamUseCase';
import { MongooseLeagueTeamRepository } from '../../persistence/mongoose/MongooseLeagueTeamRepository';
import { ExpressCreateLeagueTeamPOSTController } from '../../server/express/controllers/ExpressCreateLeagueTeamPOSTController';
import { ExpressLeagueTeamServerErrorHandler } from '../../server/express/ExpressLeagueTeamServerErrorHandler';
import { ExpressLeagueTeamRouteManager } from '../../server/express/routes/ExpressLeagueTeamRouteManager';
import { ILeagueTeamContainer } from '../ILeagueTeamContainer';
import { ExpressFindAllLeagueTeamsByLeagueIdGETController } from '../../server/express/controllers/ExpressFindAllLeagueTeamsByLeagueIdGETController';
import { MongooseTeamRepository } from '../../../../../../team/infrastructure/persistence/mongoose/MongooseTeamRepository';
import { FindAllLeagueTeamsByLeagueIdUseCase } from '../../../application/use-cases/FindAllLeagueTeamsByLeagueIdUseCase';
import { IFindAllLeagueTeamsByLeagueIdUseCase } from '../../../application/use-cases/ports/IFindAllLeagueTeamsByLeagueIdUseCase';

export class AwilixLeagueTeamDependencyInjector extends AwilixDependencyInjector<ILeagueTeamContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      leagueTeamRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressLeagueTeamRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueTeamServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueTeamServerErrorHandler.create).singleton(),
      createLeagueTeamPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateLeagueTeamPOSTController.create).singleton(),
      createLeagueTeamUseCase: AwilixDependencyInjector.registerAsFunction<ICreateLeagueTeamUseCase>((cradle: ILeagueTeamContainer) => CreateLeagueTeamUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.leagueTeamRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        leagueValidationDomainService: cradle.leagueValidationDomainService,
        leagueTeamRepository: cradle.leagueTeamRepository,
        leagueTeamValidationDomainService: cradle.leagueTeamValidationDomainService,
        teamValidationDomainService: cradle.teamValidationDomainService,
      })),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      leagueTeamRepository: AwilixDependencyInjector.registerAsFunction<ILeagueTeamRepository>(MongooseLeagueTeamRepository.create).singleton(),
      leagueValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueValidationDomainService>(LeagueValidationDomainService.create).singleton(),
      leagueRepository: AwilixDependencyInjector.registerAsFunction<ILeagueRepository>(MongooseLeagueRepository.create).singleton(),
      findAllLeagueTeamsByLeagueIdGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressFindAllLeagueTeamsByLeagueIdGETController.create).singleton(),
      findAllLeagueTeamsByLeagueIdUseCase: AwilixDependencyInjector.registerAsFunction<IFindAllLeagueTeamsByLeagueIdUseCase>(FindAllLeagueTeamsByLeagueIdUseCase.create).singleton(),
      leagueTeamValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueTeamValidationDomainService>(LeagueTeamValidationDomainService.create).singleton(),
      teamRepository: AwilixDependencyInjector.registerAsFunction<ITeamRepository>(MongooseTeamRepository.create).singleton(),
      teamValidationDomainService: AwilixDependencyInjector.registerAsFunction<TeamValidationDomainService>(TeamValidationDomainService.create).singleton(),
    });
  }

  public static create(): AwilixLeagueTeamDependencyInjector {
    return new AwilixLeagueTeamDependencyInjector();
  }
}
