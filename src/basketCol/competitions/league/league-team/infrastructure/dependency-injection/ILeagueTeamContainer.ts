import {
  ILeagueRepository,
  ITeamRepository,
  LeagueValidationDomainService,
  TeamValidationDomainService,
  BusinessDateDomainService,
  ILeagueTeamRepository,
  LeagueTeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateLeagueTeamUseCase } from '../../application/use-cases/ports/ICreateLeagueTeamUseCase';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFindAllLeagueTeamsByLeagueIdUseCase } from '../../application/use-cases/ports/IFindAllLeagueTeamsByLeagueIdUseCase';

export interface ILeagueTeamContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueTeamServerErrorHandler: IServerErrorHandler;
  createLeagueTeamPOSTController: IController;
  createLeagueTeamUseCase: ICreateLeagueTeamUseCase;
  leagueRepository: ILeagueRepository;
  teamRepository: ITeamRepository;
  fileSystem: IFileSystem;
  leagueValidationDomainService: LeagueValidationDomainService;
  teamValidationDomainService: TeamValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  leagueTeamRepository: ILeagueTeamRepository;
  leagueTeamValidationDomainService: LeagueTeamValidationDomainService;
  findAllLeagueTeamsByLeagueIdGETController: IController;
  leagueTeamRouteManager: IRouteManager;
  findAllLeagueTeamsByLeagueIdUseCase: IFindAllLeagueTeamsByLeagueIdUseCase;
}
