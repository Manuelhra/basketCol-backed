import {
  LeagueSeasonValidationDomainService,
  LeagueSeasonFixtureGameValidationDomainService,
  BusinessDateDomainService,
  ILeagueSeasonFixtureGameRepository,
  ILeagueSeasonRepository,
  CourtValidationDomainService,
  RefereeUserValidationDomainService,
  TeamValidationDomainService,
  ITeamRepository,
  IRefereeUserRepository,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IFileSystem } from '../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ICreateLeagueSeasonFixtureGameUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonFixtureGameUseCase';
import { BulkCreateLeagueSeasonFixtureGameFromExcelService } from '../services/BulkCreateLeagueSeasonFixtureGameFromExcelService';
import { IExcelManager } from '../../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';

export interface ILeagueSeasonFixtureGameContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueSeasonFixtureGameServerErrorHandler: IServerErrorHandler;
  bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController: IController;
  bulkCreateLeagueSeasonFixtureGameFromExcelService: BulkCreateLeagueSeasonFixtureGameFromExcelService;
  excelManager: IExcelManager;
  createLeagueSeasonFixtureGameUseCase: ICreateLeagueSeasonFixtureGameUseCase;
  leagueSeasonValidationDomainService: LeagueSeasonValidationDomainService;
  leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;
  leagueSeasonRepository: ILeagueSeasonRepository;
  leagueSeasonFixtureGameRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  courtValidationDomainService: CourtValidationDomainService;
  teamValidationDomainService: TeamValidationDomainService;
  refereeUserValidationDomainService: RefereeUserValidationDomainService;
  teamRepository: ITeamRepository;
  refereeUserRepository: IRefereeUserRepository;
}
