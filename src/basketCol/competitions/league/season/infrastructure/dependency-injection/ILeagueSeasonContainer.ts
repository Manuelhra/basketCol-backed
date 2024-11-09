import {
  BusinessDateService,
  CourtValidationService,
  ICourtRepository,
  ILeagueRepository,
  ILeagueSeasonRepository,
  LeagueValidationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateLeagueSeasonUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonUseCase';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';

export interface ILeagueSeasonContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueSeasonServerErrorHandler: IServerErrorHandler;
  createLeagueSeasonPOSTController: IController;
  createLeagueSeasonUseCase: ICreateLeagueSeasonUseCase;
  leagueSeasonRepository: ILeagueSeasonRepository;
  leagueValidationService: LeagueValidationService;
  leagueRepository: ILeagueRepository;
  businessDateService: BusinessDateService;
  courtValidationService: CourtValidationService;
  courtRepository: ICourtRepository;
  leagueSeasonRouteManager: IRouteManager;
  fileSystem: IFileSystem;
}
