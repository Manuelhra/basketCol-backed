import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  ILeagueSeasonFixtureRepository,
  ILeagueSeasonRepository,
  LeagueSeasonFixtureValidationDomainService,
  LeagueSeasonValidationDomainService,
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
import { BulkCreateLeagueSeasonFixtureFromExcelService } from '../../services/BulkCreateLeagueSeasonFixtureFromExcelService';
import { ILeagueSeasonFixtureContainer } from '../ILeagueSeasonFixtureContainer';
import { MongooseLeagueSeasonFixtureRepository } from '../../persistence/mongoose/MongooseLeagueSeasonFixtureRepository';
import { MongooseLeagueSeasonRepository } from '../../../../infrastructure/persistence/mongoose/MongooseLeagueSeasonRepository';
import { IRouteManager } from '../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { GlobFileSystem } from '../../../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { ExpressLeagueSeasonFixtureRouteManager } from '../../server/express/routes/ExpressLeagueSeasonFixtureRouteManager';
import { IExcelManager } from '../../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { XLSXManager } from '../../../../../../../shared/infrastructure/file-upload/excel/xlsx/XLSXManager';
import { UuidV4Generator } from '../../../../../../../shared/infrastructure/uuid/UuidV4Generator';
import { IUuidGenerator } from '../../../../../../../shared/application/uuid/ports/IUuidGenerator';
import { ExpressFindAllLeagueSeasonFixturesByLeagueSeasonIdGETController } from '../../server/express/controllers/ExpressFindAllLeagueSeasonFixturesByLeagueSeasonIdGETController';
import { IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase } from '../../../application/use-cases/ports/IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase';
import { FindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase } from '../../../application/use-cases/FindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase';
import { ExpressFindLeagueSeasonFixtureByIdGETController } from '../../server/express/controllers/ExpressFindLeagueSeasonFixtureByIdGETController';
import { IFindLeagueSeasonFixtureByIdUseCase } from '../../../application/use-cases/ports/IFindLeagueSeasonFixtureByIdUseCase';
import { FindLeagueSeasonFixtureByIdUseCase } from '../../../application/use-cases/FindLeagueSeasonFixtureByIdUseCase';

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
      bulkCreateLeagueSeasonFixtureFromExcelService: AwilixDependencyInjector.registerAsFunction<BulkCreateLeagueSeasonFixtureFromExcelService>(BulkCreateLeagueSeasonFixtureFromExcelService.create).singleton(),
      excelManager: AwilixDependencyInjector.registerAsFunction<IExcelManager>(XLSXManager.create).singleton(),
      createLeagueSeasonFixtureUseCase: AwilixDependencyInjector.registerAsFunction<ICreateLeagueSeasonFixtureUseCase>((cradle: ILeagueSeasonFixtureContainer) => CreateLeagueSeasonFixtureUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.leagueSeasonFixtureRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        leagueSeasonFixtureValidationDomainService: cradle.leagueSeasonFixtureValidationDomainService,
        leagueSeasonFixtureRepository: cradle.leagueSeasonFixtureRepository,
        leagueSeasonValidationDomainService: cradle.leagueSeasonValidationDomainService,
      })),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      leagueSeasonFixtureRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonFixtureRepository>(MongooseLeagueSeasonFixtureRepository.create).singleton(),
      leagueSeasonFixtureValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonFixtureValidationDomainService>(LeagueSeasonFixtureValidationDomainService.create).singleton(),
      leagueSeasonValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonValidationDomainService>(LeagueSeasonValidationDomainService.create).singleton(),
      leagueSeasonRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonRepository>(MongooseLeagueSeasonRepository.create).singleton(),
      uuidGenerator: AwilixDependencyInjector.registerAsFunction<IUuidGenerator>(UuidV4Generator.create).singleton(),
      findAllLeagueSeasonFixturesByLeagueSeasonIdGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressFindAllLeagueSeasonFixturesByLeagueSeasonIdGETController.create).singleton(),
      findAllLeagueSeasonFixturesByLeagueSeasonIdUseCase: AwilixDependencyInjector.registerAsFunction<IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase>(FindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase.create).singleton(),
      findLeagueSeasonFixtureByIdGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressFindLeagueSeasonFixtureByIdGETController.create).singleton(),
      findLeagueSeasonFixtureByIdUseCase: AwilixDependencyInjector.registerAsFunction<IFindLeagueSeasonFixtureByIdUseCase>(FindLeagueSeasonFixtureByIdUseCase.create).singleton(),
    });
  }

  public static create(): AwilixLeagueSeasonFixtureDependencyInjector {
    return new AwilixLeagueSeasonFixtureDependencyInjector();
  }
}
