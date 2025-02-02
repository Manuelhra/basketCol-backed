import {
  IdUniquenessValidatorDomainService,
  LeagueSeasonFixtureGameValidationDomainService,
  TeamValidationDomainService,
  BusinessDateDomainService,
  ITeamLeagueSeasonFixtureGameBoxScoreRepository,
  ITeamRepository,
  ILeagueSeasonFixtureGameRepository,
  ITeamAllTimeStatsRepository,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IUuidGenerator } from '../../../../../../../../../shared/application/uuid/ports/IUuidGenerator';
import { IExcelManager } from '../../../../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { IController } from '../../../../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IUpdateTeamAllTimeStatsAfterGameUseCase } from '../../../../../../../../../team/all-time-stats/application/use-cases/ports/IUpdateTeamAllTimeStatsAfterGameUseCase';
import { ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase } from '../../application/use-cases/ports/ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase';
import { IRouteManager } from '../../../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService } from '../services/BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService';

export interface ITeamLeagueSeasonFixtureGameBoxScoreContainer {
  httpResponseHandler: IHttpResponseHandler;
  teamLeagueSeasonFixtureGameBoxScoreServerErrorHandler: IServerErrorHandler;
  bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController: IController;
  bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService: BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService;
  uuidGenerator: IUuidGenerator;
  createTeamLeagueSeasonFixtureGameBoxScoreUseCase: ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase;
  excelManager: IExcelManager;
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;
  teamValidationDomainService: TeamValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  teamLeagueSeasonFixtureGameBoxScoreRepository: ITeamLeagueSeasonFixtureGameBoxScoreRepository;
  updateTeamAllTimeStatsAfterGameUseCase: IUpdateTeamAllTimeStatsAfterGameUseCase;
  teamRepository: ITeamRepository;
  teamLeagueSeasonFixtureGameBoxScoreRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;
  teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;
}
