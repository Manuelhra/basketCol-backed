import {
  BusinessDateDomainService,
  ILeagueSeasonFixtureRepository,
  ILeagueSeasonRepository,
  LeagueSeasonFixtureValidationDomainService,
  LeagueSeasonValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateLeagueSeasonFixtureUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonFixtureUseCase';
import { BulkCreateLeagueSeasonFixtureFromExcelService } from '../services/BulkCreateLeagueSeasonFixtureFromExcelService';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { IExcelManager } from '../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { IUuidGenerator } from '../../../../../../shared/application/uuid/ports/IUuidGenerator';
import { IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase } from '../../application/use-cases/ports/IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase';
import { IFindLeagueSeasonFixtureByIdUseCase } from '../../application/use-cases/ports/IFindLeagueSeasonFixtureByIdUseCase';

export interface ILeagueSeasonFixtureContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueSeasonFixtureServerErrorHandler: IServerErrorHandler;
  bulkCreateLeagueSeasonFixtureFromExcelPOSTController: IController;
  bulkCreateLeagueSeasonFixtureFromExcelService: BulkCreateLeagueSeasonFixtureFromExcelService;
  excelManager: IExcelManager;
  createLeagueSeasonFixtureUseCase: ICreateLeagueSeasonFixtureUseCase;
  leagueSeasonValidationDomainService: LeagueSeasonValidationDomainService;
  leagueSeasonFixtureValidationDomainService: LeagueSeasonFixtureValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;
  leagueSeasonRepository: ILeagueSeasonRepository;
  leagueSeasonFixtureRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  uuidGenerator: IUuidGenerator;
  findAllLeagueSeasonFixturesByLeagueSeasonIdGETController: IController;
  findAllLeagueSeasonFixturesByLeagueSeasonIdUseCase: IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase;
  findLeagueSeasonFixtureByIdGETController: IController;
  findLeagueSeasonFixtureByIdUseCase: IFindLeagueSeasonFixtureByIdUseCase;
}
