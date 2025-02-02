import {
  IdUniquenessValidatorDomainService,
  LeagueSeasonFixtureGameValidationDomainService,
  PlayerUserValidationDomainService,
  BusinessDateDomainService,
  IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository,
  IPlayerUserRepository,
  ITeamPlayerRepository,
  ILeagueSeasonFixtureGameRepository,
  SecurePasswordCreationDomainService,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserCareerStatsRepository,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IUuidGenerator } from '../../../../../../../../../shared/application/uuid/ports/IUuidGenerator';
import { IFileSystem } from '../../../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { IExcelManager } from '../../../../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { IController } from '../../../../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IUpdatePlayerUserCareerStatsAfterGameUseCase } from '../../../../../../../../../users/player/career-stats/application/use-cases/ports/IUpdatePlayerUserCareerStatsAfterGameUseCase';
import { ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase } from '../../application/use-cases/ports/ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase';
import { BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService } from '../services/BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService';

export interface IPlayerUserLeagueSeasonFixtureGameBoxScoreContainer {
  httpResponseHandler: IHttpResponseHandler;
  playerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler: IServerErrorHandler;
  bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController: IController;
  bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService: BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService;
  uuidGenerator: IUuidGenerator;
  createPlayerUserLeagueSeasonFixtureGameBoxScoreUseCase: ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase;
  excelManager: IExcelManager;
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  playerUserLeagueSeasonFixtureGameBoxScoreRepository: IPlayerUserLeagueSeasonFixtureGameBoxScoreRepository;
  updatePlayerUserCareerStatsAfterGameUseCase: IUpdatePlayerUserCareerStatsAfterGameUseCase;
  playerUserRepository: IPlayerUserRepository;
  playerUserLeagueSeasonFixtureGameBoxScoreRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  teamPlayerRepository: ITeamPlayerRepository;
  leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
}
