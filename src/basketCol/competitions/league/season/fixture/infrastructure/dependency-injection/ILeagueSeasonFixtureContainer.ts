import {
  BusinessDateService,
  ILeagueSeasonFixtureRepository,
  ILeagueSeasonRepository,
  LeagueSeasonFixtureDateValidatorService,
  LeagueSeasonFixtureValidationService,
  LeagueSeasonValidationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateLeagueSeasonFixtureUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonFixtureUseCase';
import { BulkCreateLeagueSeasonFixtureService } from '../services/BulkCreateLeagueSeasonFixtureService';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { IExcelManager } from '../../../../../../shared/infrastructure/excel/ports/IExcelManager';

export interface ILeagueSeasonFixtureContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueSeasonFixtureServerErrorHandler: IServerErrorHandler;
  bulkCreateLeagueSeasonFixtureFromExcelPOSTController: IController;
  bulkCreateLeagueSeasonFixtureService: BulkCreateLeagueSeasonFixtureService;
  excelManager: IExcelManager;
  createLeagueSeasonFixtureUseCase: ICreateLeagueSeasonFixtureUseCase;
  leagueSeasonValidationService: LeagueSeasonValidationService;
  leagueSeasonFixtureValidationService: LeagueSeasonFixtureValidationService;
  businessDateService: BusinessDateService;
  leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;
  leagueSeasonFixtureDateValidatorService: LeagueSeasonFixtureDateValidatorService;
  leagueSeasonRepository: ILeagueSeasonRepository;
  leagueSeasonFixtureRouteManager: IRouteManager;
  fileSystem: IFileSystem;
}
