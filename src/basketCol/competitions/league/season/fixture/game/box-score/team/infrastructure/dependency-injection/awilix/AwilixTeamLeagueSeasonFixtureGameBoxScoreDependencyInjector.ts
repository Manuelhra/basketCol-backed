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
import { ExpressBulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController } from '../../server/express/controllers/ExpressBulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController';
import { ExpressTeamLeagueSeasonFixtureGameBoxScoreServerErrorHandler } from '../../server/express/ExpressTeamLeagueSeasonFixtureGameBoxScoreServerErrorHandler';
import { ExpressTeamLeagueSeasonFixtureGameBoxScoreRouterManager } from '../../server/express/routes/ExpressTeamLeagueSeasonFixtureGameBoxScoreRouteManager';
import { ITeamLeagueSeasonFixtureGameBoxScoreContainer } from '../ITeamLeagueSeasonFixtureGameBoxScoreContainer';
import { IUuidGenerator } from '../../../../../../../../../../shared/application/uuid/ports/IUuidGenerator';
import { UuidV4Generator } from '../../../../../../../../../../shared/infrastructure/uuid/UuidV4Generator';
import { BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService } from '../../services/BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService';

export class AwilixTeamLeagueSeasonFixtureGameBoxScoreDependencyInjector
  extends AwilixDependencyInjector<ITeamLeagueSeasonFixtureGameBoxScoreContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      teamLeagueSeasonFixtureGameBoxScoreRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressTeamLeagueSeasonFixtureGameBoxScoreRouterManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      teamLeagueSeasonFixtureGameBoxScoreServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressTeamLeagueSeasonFixtureGameBoxScoreServerErrorHandler.create).singleton(),
      bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressBulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController.create).singleton(),
      excelManager: AwilixDependencyInjector.registerAsFunction<IExcelManager>(XLSXManager.create).singleton(),
      bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService: AwilixDependencyInjector.registerAsFunction<BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService>(BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService.create).singleton(),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      uuidGenerator: AwilixDependencyInjector.registerAsFunction<IUuidGenerator>(UuidV4Generator.create).singleton(),
    });
  }

  public static create(): AwilixTeamLeagueSeasonFixtureGameBoxScoreDependencyInjector {
    return new AwilixTeamLeagueSeasonFixtureGameBoxScoreDependencyInjector();
  }
}
