import {
  BusinessDateService,
  ILeagueFounderUserRepository,
  ILeagueRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  LeagueFounderUserValidationService,
  LeagueValidationNameService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateLeagueUseCase } from '../../application/use-cases/ports/ICreateLeagueUseCase';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { ISearchLeaguesUseCase } from '../../application/use-cases/ports/ISearchLeaguesUseCase';

export interface ILeagueContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueServerErrorHandler: IServerErrorHandler;
  createLeaguePOSTController: IController;
  createLeagueUseCase: ICreateLeagueUseCase;
  businessDateService: BusinessDateService;
  leagueValidationNameService: LeagueValidationNameService;
  leagueRepository: ILeagueRepository;
  leagueFounderUserValidationService: LeagueFounderUserValidationService;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
  leagueRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationService: SecurePasswordCreationService;
  passwordHashingService: IPasswordHashingService;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  searchLeaguesGETController: IController;
  searchLeaguesUseCase: ISearchLeaguesUseCase;
}
