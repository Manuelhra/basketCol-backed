import {
  BusinessDateDomainService,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserCareerStatsRepository,
  IPlayerUserRepository,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreatePlayerUserUseCase } from '../../application/use-cases/ports/ICreatePlayerUserUseCase';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { IProfileImageUploader } from '../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { ISearchAllPlayerUsersUseCase } from '../../application/use-cases/ports/ISearchAllPlayerUsersUseCase';
import { ICreatePlayerUserCareerStatsUseCase } from '../../career-stats/application/use-cases/ports/ICreatePlayerUserCareerStatsUseCase';
import { IUuidGenerator } from '../../../../shared/application/uuid/ports/IUuidGenerator';

export interface IPlayerUserContainer {
  httpResponseHandler: IHttpResponseHandler;
  playerUserServerErrorHandler: IServerErrorHandler;
  createPlayerUserPOSTController: IController;
  createPlayerUserUseCase: ICreatePlayerUserUseCase;
  playerUserRepository: IPlayerUserRepository;
  businessDateDomainService: BusinessDateDomainService;
  playerUserRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  profileImageUploader: IProfileImageUploader;
  searchAllPlayerUsersGETController: IController;
  searchAllPlayerUsersUseCase: ISearchAllPlayerUsersUseCase;
  createPlayerUserCareerStatsUseCase: ICreatePlayerUserCareerStatsUseCase;
  playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
  uuidGenerator: IUuidGenerator;
  playerUserValidationDomainService: PlayerUserValidationDomainService
}
