import {
  BusinessDateDomainService,
  CourtValidationDomainService,
  ICourtRepository,
  ILeagueRepository,
  ILeagueSeasonRepository,
  LeagueValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateLeagueSeasonUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonUseCase';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { IFindAllLeagueSeasonsByLeagueIdUseCase } from '../../application/use-cases/ports/IFindAllLeagueSeasonsByLeagueIdUseCase';

export interface ILeagueSeasonContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueSeasonServerErrorHandler: IServerErrorHandler;
  createLeagueSeasonPOSTController: IController;
  createLeagueSeasonUseCase: ICreateLeagueSeasonUseCase;
  leagueSeasonRepository: ILeagueSeasonRepository;
  leagueValidationDomainService: LeagueValidationDomainService;
  leagueRepository: ILeagueRepository;
  businessDateDomainService: BusinessDateDomainService;
  courtValidationDomainService: CourtValidationDomainService;
  courtRepository: ICourtRepository;
  leagueSeasonRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  findAllLeagueSeasonsByLeagueIdGETController: IController;
  findAllLeagueSeasonsByLeagueIdUseCase: IFindAllLeagueSeasonsByLeagueIdUseCase;
}
