import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserCareerStatsRepository,
  IPlayerUserRepository,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';

import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { ICreatePlayerUserCareerStatsUseCase } from '../../application/use-cases/ports/ICreatePlayerUserCareerStatsUseCase';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { IFindCareerStatsByPlayerUserIdUseCase } from '../../application/use-cases/ports/IFindCareerStatsByPlayerUserIdUseCase';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';

export interface IPlayerUserCareerStatsContainer {
  createPlayerUserCareerStatsPOSTController: IController;
  createPlayerUserCareerStatsUseCase: ICreatePlayerUserCareerStatsUseCase;
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  idUniquenessValidatorDomainServiceRepository: IPlayerUserCareerStatsRepository;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
  playerUserRepository: IPlayerUserRepository;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  playerUserCareerStatsRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  findCareerStatsByPlayerUserIdGETController: IController;
  findCareerStatsByPlayerUserIdUseCase: IFindCareerStatsByPlayerUserIdUseCase;
  httpResponseHandler: IHttpResponseHandler;
}
