import {
  BusinessDateDomainService,
  CourtValidationDomainService,
  ICourtRepository,
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  ILeagueRepository,
  ILeagueSeasonRepository,
  LeagueValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { CreateLeagueSeasonUseCase } from '../../../application/use-cases/CreateLeagueSeasonUseCase';
import { ICreateLeagueSeasonUseCase } from '../../../application/use-cases/ports/ICreateLeagueSeasonUseCase';
import { ExpressCreateLeagueSeasonPOSTController } from '../../server/express/controllers/ExpressCreateLeagueSeasonPOSTController';
import { ExpressLeagueSeasonServerErrorHandler } from '../../server/express/ExpressLeagueSeasonServerErrorHandler';
import { ExpressLeagueSeasonRouteManager } from '../../server/express/routes/ExpressLeagueSeasonRouteManager';
import { ILeagueSeasonContainer } from '../ILeagueSeasonContainer';
import { MongooseLeagueSeasonRepository } from '../../persistence/mongoose/MongooseLeagueSeasonRepository';
import { MongooseCourtRepository } from '../../../../../../facilities/court/infrastructure/persistence/mongoose/MongooseCourtRepository';
import { MongooseLeagueRepository } from '../../../../infrastructure/persistence/mongoose/MongooseLeagueRepository';

export class AwilixLeagueSeasonDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      leagueSeasonRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressLeagueSeasonRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueSeasonServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueSeasonServerErrorHandler.create).singleton(),
      createLeagueSeasonPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateLeagueSeasonPOSTController.create).singleton(),
      createLeagueSeasonUseCase: AwilixDependencyInjector.registerAsFunction<ICreateLeagueSeasonUseCase>((cradle: ILeagueSeasonContainer) => CreateLeagueSeasonUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.leagueSeasonRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        courtValidationDomainService: cradle.courtValidationDomainService,
        leagueValidationDomainService: cradle.leagueValidationDomainService,
        leagueSeasonRepository: cradle.leagueSeasonRepository,
      })),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      leagueSeasonRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonRepository>(MongooseLeagueSeasonRepository.create).singleton(),
      courtValidationDomainService: AwilixDependencyInjector.registerAsFunction<CourtValidationDomainService>(CourtValidationDomainService.create).singleton(),
      courtRepository: AwilixDependencyInjector.registerAsFunction<ICourtRepository>(MongooseCourtRepository.create).singleton(),
      leagueValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueValidationDomainService>(LeagueValidationDomainService.create).singleton(),
      leagueRepository: AwilixDependencyInjector.registerAsFunction<ILeagueRepository>(MongooseLeagueRepository.create).singleton(),
    });
  }

  public static create(): AwilixLeagueSeasonDependencyInjector {
    return new AwilixLeagueSeasonDependencyInjector();
  }
}
