import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  ILeagueSeasonFixtureGameRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserCareerStatsRepository,
  IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository,
  IPlayerUserRepository,
  ITeamPlayerRepository,
  LeagueSeasonFixtureGameValidationDomainService,
  PasswordValueObjectCreationDomainService,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';

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
import { ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase } from '../../../application/use-cases/ports/ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase';
import { CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase } from '../../../application/use-cases/CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase';
import { MongooseTeamPlayerRepository } from '../../../../../../../../../../team/team-player/infrastructure/persistence/mongoose/MongooseTeamPlayerRepository';
import { MongoosePlayerUserLeagueSeasonFixtureGameBoxScoreRepository } from '../../persistence/mongoose/MongoosePlayerUserLeagueSeasonFixtureGameBoxScoreRepository';
import { MongoosePlayerUserRepository } from '../../../../../../../../../../users/player/infrastructure/persistence/mongoose/MongoosePlayerUserRepository';
import { IUpdatePlayerUserCareerStatsAfterGameUseCase } from '../../../../../../../../../../users/player/career-stats/application/use-cases/ports/IUpdatePlayerUserCareerStatsAfterGameUseCase';
import { UpdatePlayerUserCareerStatsAfterGameUseCase } from '../../../../../../../../../../users/player/career-stats/application/use-cases/UpdatePlayerUserCareerStatsAfterGameUseCase';
import { MongooseLeagueSeasonFixtureGameRepository } from '../../../../../infrastructure/persistence/MongooseLeagueSeasonFixtureGameRepository';
import { BcryptPasswordHashingService } from '../../../../../../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { MongoosePlayerUserCareerStatsRepository } from '../../../../../../../../../../users/player/career-stats/infrastructure/persistence/mongoose/MongoosePlayerUserCareerStatsRepository';

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
      createPlayerUserLeagueSeasonFixtureGameBoxScoreUseCase: AwilixDependencyInjector.registerAsFunction<ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase>((cradle: IPlayerUserLeagueSeasonFixtureGameBoxScoreContainer) => CreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.playerUserLeagueSeasonFixtureGameBoxScoreRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        leagueSeasonFixtureGameValidationDomainService: cradle.leagueSeasonFixtureGameValidationDomainService,
        playerUserLeagueSeasonFixtureGameBoxScoreRepository: cradle.playerUserLeagueSeasonFixtureGameBoxScoreRepository,
        playerUserValidationDomainService: cradle.playerUserValidationDomainService,
        teamPlayerRepository: cradle.teamPlayerRepository,
        updatePlayerUserCareerStatsAfterGameUseCase: cradle.updatePlayerUserCareerStatsAfterGameUseCase,
      })).singleton(),
      playerUserLeagueSeasonFixtureGameBoxScoreRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository>(MongoosePlayerUserLeagueSeasonFixtureGameBoxScoreRepository.create).singleton(),
      excelManager: AwilixDependencyInjector.registerAsFunction<IExcelManager>(XLSXManager.create).singleton(),
      bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService: AwilixDependencyInjector.registerAsFunction<BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService>(BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService.create).singleton(),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      uuidGenerator: AwilixDependencyInjector.registerAsFunction<IUuidGenerator>(UuidV4Generator.create).singleton(),
      teamPlayerRepository: AwilixDependencyInjector.registerAsFunction<ITeamPlayerRepository>(MongooseTeamPlayerRepository.create).singleton(),
      leagueSeasonFixtureGameValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonFixtureGameValidationDomainService>(LeagueSeasonFixtureGameValidationDomainService.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      playerUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<PlayerUserValidationDomainService>(PlayerUserValidationDomainService.create).singleton(),
      updatePlayerUserCareerStatsAfterGameUseCase: AwilixDependencyInjector.registerAsFunction<IUpdatePlayerUserCareerStatsAfterGameUseCase>(UpdatePlayerUserCareerStatsAfterGameUseCase.create).singleton(),
      leagueSeasonFixtureGameRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonFixtureGameRepository>(MongooseLeagueSeasonFixtureGameRepository.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      playerUserCareerStatsRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserCareerStatsRepository>(MongoosePlayerUserCareerStatsRepository.create).singleton(),
    });
  }

  public static create(): AwilixPlayerUserLeagueSeasonFixtureGameBoxScoreDependencyInjector {
    return new AwilixPlayerUserLeagueSeasonFixtureGameBoxScoreDependencyInjector();
  }
}
