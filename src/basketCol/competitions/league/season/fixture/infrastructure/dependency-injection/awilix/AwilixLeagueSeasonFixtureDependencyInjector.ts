import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IIdUniquenessValidatorServiceRepository,
  ILeagueSeasonFixtureRepository,
  ILeagueSeasonRepository,
  LeagueSeasonFixtureDateValidatorService,
  LeagueSeasonFixtureValidationService,
  LeagueSeasonValidationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { CreateLeagueSeasonFixtureUseCase } from '../../../application/use-cases/CreateLeagueSeasonFixtureUseCase';
import { ICreateLeagueSeasonFixtureUseCase } from '../../../application/use-cases/ports/ICreateLeagueSeasonFixtureUseCase';
import { ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController } from '../../server/express/controllers/ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController';
import { ExpressLeagueSeasonFixtureServerErrorHandler } from '../../server/express/ExpressLeagueSeasonFixtureServerErrorHandler';
import { BulkCreateLeagueSeasonFixtureService } from '../../services/BulkCreateLeagueSeasonFixtureService';
import { ILeagueSeasonFixtureContainer } from '../ILeagueSeasonFixtureContainer';
import { MongooseLeagueSeasonFixtureRepository } from '../../persistence/mongoose/MongooseLeagueSeasonFixtureRepository';
import { MongooseLeagueSeasonRepository } from '../../../../infrastructure/persistence/mongoose/MongooseLeagueSeasonRepository';
import { IRouteManager } from '../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { GlobFileSystem } from '../../../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { ExpressLeagueSeasonFixtureRouteManager } from '../../server/express/routes/ExpressLeagueSeasonFixtureRouteManager';
import { IExcelManager } from '../../../../../../../shared/infrastructure/excel/ports/IExcelManager';
import { XLSXManager } from '../../../../../../../shared/infrastructure/excel/xlsx/XLSXManager';

export class AwilixLeagueSeasonFixtureDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonFixtureContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      leagueSeasonFixtureRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressLeagueSeasonFixtureRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueSeasonFixtureServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueSeasonFixtureServerErrorHandler.create).singleton(),
      bulkCreateLeagueSeasonFixtureFromExcelPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController.create).singleton(),
      bulkCreateLeagueSeasonFixtureService: AwilixDependencyInjector.registerAsFunction<BulkCreateLeagueSeasonFixtureService>(BulkCreateLeagueSeasonFixtureService.create).singleton(),
      excelManager: AwilixDependencyInjector.registerAsFunction<IExcelManager>(XLSXManager.create).singleton(),
      createLeagueSeasonFixtureUseCase: AwilixDependencyInjector.registerAsFunction<ICreateLeagueSeasonFixtureUseCase>((cradle: ILeagueSeasonFixtureContainer) => CreateLeagueSeasonFixtureUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.leagueSeasonFixtureRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        leagueSeasonFixtureDateValidatorService: cradle.leagueSeasonFixtureDateValidatorService,
        leagueSeasonFixtureValidationService: cradle.leagueSeasonFixtureValidationService,
        leagueSeasonFixtureRepository: cradle.leagueSeasonFixtureRepository,
        leagueSeasonValidationService: cradle.leagueSeasonValidationService,
      })),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      leagueSeasonFixtureRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonFixtureRepository>(MongooseLeagueSeasonFixtureRepository.create).singleton(),
      leagueSeasonFixtureDateValidatorService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonFixtureDateValidatorService>(LeagueSeasonFixtureDateValidatorService.create).singleton(),
      leagueSeasonFixtureValidationService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonFixtureValidationService>(LeagueSeasonFixtureValidationService.create).singleton(),
      leagueSeasonValidationService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonValidationService>(LeagueSeasonValidationService.create).singleton(),
      leagueSeasonRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonRepository>(MongooseLeagueSeasonRepository.create).singleton(),
    });
  }

  public static create(): AwilixLeagueSeasonFixtureDependencyInjector {
    return new AwilixLeagueSeasonFixtureDependencyInjector();
  }
}
