import {
  BusinessDateDomainService,
  CourtValidationDomainService,
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  ILeagueSeasonFixtureGameRepository,
  ILeagueSeasonRepository,
  IRefereeUserRepository,
  ITeamRepository,
  LeagueSeasonFixtureGameValidationDomainService,
  LeagueSeasonValidationDomainService,
  RefereeUserValidationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { CreateLeagueSeasonFixtureGameUseCase } from '../../../application/use-cases/CreateLeagueSeasonFixtureGameUseCase';
import { ICreateLeagueSeasonFixtureGameUseCase } from '../../../application/use-cases/ports/ICreateLeagueSeasonFixtureGameUseCase';
import { ExpressBulkCreateLeagueSeasonFixtureGameFromExcelPOSTController } from '../../server/express/controllers/ExpressBulkCreateLeagueSeasonFixtureGameFromExcelPOSTController';
import { ExpressLeagueSeasonFixtureGameServerErrorHandler } from '../../server/express/ExpressLeagueSeasonFixtureGame';
import { ExpressLeagueSeasonFixtureGameRouteManager } from '../../server/express/routes/ExpressLeagueSeasonFixtureGameRouteManager';
import { BulkCreateLeagueSeasonFixtureGameFromExcelService } from '../../services/BulkCreateLeagueSeasonFixtureGameFromExcelService';
import { ILeagueSeasonFixtureGameContainer } from '../ILeagueSeasonFixtureGameContainer';
import { MongooseLeagueSeasonFixtureGameRepository } from '../../persistence/MongooseLeagueSeasonFixtureGameRepository';
import { MongooseLeagueSeasonRepository } from '../../../../../infrastructure/persistence/mongoose/MongooseLeagueSeasonRepository';
import { MongooseRefereeUserRepository } from '../../../../../../../../users/referee/infrastructure/persistence/mongoose/MongooseRefereeUserRepository';
import { MongooseTeamRepository } from '../../../../../../../../team/infrastructure/persistence/mongoose/MongooseTeamRepository';
import { IExcelManager } from '../../../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { XLSXManager } from '../../../../../../../../shared/infrastructure/file-upload/excel/xlsx/XLSXManager';

export class AwilixLeagueSeasonFixtureGameDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonFixtureGameContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      leagueSeasonFixtureGameRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressLeagueSeasonFixtureGameRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueSeasonFixtureGameServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueSeasonFixtureGameServerErrorHandler.create).singleton(),
      bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressBulkCreateLeagueSeasonFixtureGameFromExcelPOSTController.create).singleton(),
      bulkCreateLeagueSeasonFixtureGameFromExcelService: AwilixDependencyInjector.registerAsFunction<BulkCreateLeagueSeasonFixtureGameFromExcelService>(BulkCreateLeagueSeasonFixtureGameFromExcelService.create).singleton(),
      excelManager: AwilixDependencyInjector.registerAsFunction<IExcelManager>(XLSXManager.create).singleton(),
      createLeagueSeasonFixtureGameUseCase: AwilixDependencyInjector.registerAsFunction<ICreateLeagueSeasonFixtureGameUseCase>((cradle: ILeagueSeasonFixtureGameContainer) => CreateLeagueSeasonFixtureGameUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.leagueSeasonFixtureGameRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        courtValidationDomainService: cradle.courtValidationDomainService,
        leagueSeasonFixtureGameRepository: cradle.leagueSeasonFixtureGameRepository,
        leagueSeasonValidationDomainService: cradle.leagueSeasonValidationDomainService,
        refereeUserValidationDomainService: cradle.refereeUserValidationDomainService,
        teamValidationDomainService: cradle.teamValidationDomainService,
      })),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      courtValidationDomainService: AwilixDependencyInjector.registerAsFunction<CourtValidationDomainService>(CourtValidationDomainService.create).singleton(),
      leagueSeasonFixtureGameRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonFixtureGameRepository>(MongooseLeagueSeasonFixtureGameRepository.create).singleton(),
      leagueSeasonFixtureGameValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonFixtureGameValidationDomainService>(LeagueSeasonFixtureGameValidationDomainService.create).singleton(),
      leagueSeasonValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonValidationDomainService>(LeagueSeasonValidationDomainService.create).singleton(),
      leagueSeasonRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonRepository>(MongooseLeagueSeasonRepository.create).singleton(),
      refereeUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<RefereeUserValidationDomainService>(RefereeUserValidationDomainService.create).singleton(),
      teamValidationDomainService: AwilixDependencyInjector.registerAsFunction<TeamValidationDomainService>(TeamValidationDomainService.create).singleton(),
      teamRepository: AwilixDependencyInjector.registerAsFunction<ITeamRepository>(MongooseTeamRepository.create).singleton(),
      refereeUserRepository: AwilixDependencyInjector.registerAsFunction<IRefereeUserRepository>(MongooseRefereeUserRepository.create).singleton(),
    });
  }

  public static create(): AwilixLeagueSeasonFixtureGameDependencyInjector {
    return new AwilixLeagueSeasonFixtureGameDependencyInjector();
  }
}
