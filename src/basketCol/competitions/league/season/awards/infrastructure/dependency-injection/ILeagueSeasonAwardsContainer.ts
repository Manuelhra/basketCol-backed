import {
  BusinessDateDomainService,
  ILeagueSeasonAwardsRepository,
  ILeagueSeasonRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserRepository,
  ITeamRepository,
  LeagueSeasonValidationDomainService,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ICreateLeagueSeasonAwardsUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonAwardsUseCase';
import { IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase } from '../../application/use-cases/ports/IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase';

export interface ILeagueSeasonAwardsContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueSeasonAwardsRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  createLeagueSeasonAwardsPOSTController: IController;
  createLeagueSeasonAwardsUseCase: ICreateLeagueSeasonAwardsUseCase;
  findLeagueSeasonAwardsByLeagueSeasonIdGETController: IController;
  findLeagueSeasonAwardsByLeagueSeasonIdUseCase: IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  teamValidationDomainService: TeamValidationDomainService;
  leagueSeasonValidationDomainService: LeagueSeasonValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  leagueSeasonAwardsRepository: ILeagueSeasonAwardsRepository;
  leagueSeasonRepository: ILeagueSeasonRepository;
  playerUserRepository: IPlayerUserRepository;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  teamRepository: ITeamRepository;
}
