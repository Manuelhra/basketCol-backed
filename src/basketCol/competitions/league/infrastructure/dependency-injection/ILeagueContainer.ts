import {
  BusinessDateDomainService,
  ILeagueFounderUserRepository,
  ILeagueRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  LeagueFounderUserValidationDomainService,
  LeagueValidationDomainService,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateLeagueUseCase } from '../../application/use-cases/ports/ICreateLeagueUseCase';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { ISearchAllLeaguesUseCase } from '../../application/use-cases/ports/ISearchAllLeaguesUseCase';

export interface ILeagueContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueServerErrorHandler: IServerErrorHandler;
  createLeaguePOSTController: IController;
  createLeagueUseCase: ICreateLeagueUseCase;
  businessDateDomainService: BusinessDateDomainService;
  leagueRepository: ILeagueRepository;
  leagueFounderUserValidationDomainService: LeagueFounderUserValidationDomainService;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
  leagueRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  searchAllLeaguesGETController: IController;
  searchAllLeaguesUseCase: ISearchAllLeaguesUseCase;
  leagueValidationDomainService: LeagueValidationDomainService;
}
