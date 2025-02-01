import { BusinessDateDomainService } from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { IExcelManager } from '../../../../../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { XLSXManager } from '../../../../../../../../../../shared/infrastructure/file-upload/excel/xlsx/XLSXManager';
import { HttpResponseHandler } from '../../../../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ExpressBulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController } from '../../server/express/controllers/ExpressBulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController';
import { ExpressPlayerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler } from '../../server/express/ExpressPlayerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler';
import { ExpressPlayerUserLeagueSeasonFixtureGameBoxScoreRouterManager } from '../../server/express/routes/ExpressPlayerUserLeagueSeasonFixtureGameBoxScoreRouteManager';
import { IPlayerUserLeagueSeasonFixtureGameBoxScoreContainer } from '../IPlayerUserLeagueSeasonFixtureGameBoxScoreContainer';
import { IUuidGenerator } from '../../../../../../../../../../shared/application/uuid/ports/IUuidGenerator';
import { UuidV4Generator } from '../../../../../../../../../../shared/infrastructure/uuid/UuidV4Generator';
import { BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService } from '../../services/BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService';

export class AwilixPlayerUserLeagueSeasonFixtureGameBoxScoreDependencyInjector
  extends AwilixDependencyInjector<IPlayerUserLeagueSeasonFixtureGameBoxScoreContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      playerUserLeagueSeasonFixtureGameBoxScoreRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressPlayerUserLeagueSeasonFixtureGameBoxScoreRouterManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      playerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressPlayerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler.create).singleton(),
      bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressBulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController.create).singleton(),
      excelManager: AwilixDependencyInjector.registerAsFunction<IExcelManager>(XLSXManager.create).singleton(),
      bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService: AwilixDependencyInjector.registerAsFunction<BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService>(BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService.create).singleton(),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      uuidGenerator: AwilixDependencyInjector.registerAsFunction<IUuidGenerator>(UuidV4Generator.create).singleton(),
    });
  }

  public static create(): AwilixPlayerUserLeagueSeasonFixtureGameBoxScoreDependencyInjector {
    return new AwilixPlayerUserLeagueSeasonFixtureGameBoxScoreDependencyInjector();
  }
}
