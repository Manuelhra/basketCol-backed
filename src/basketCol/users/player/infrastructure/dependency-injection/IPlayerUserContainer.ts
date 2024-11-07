import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IPlayerUserRepository,
  PlayerUserNicknameValidationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreatePlayerUserUseCase } from '../../application/use-cases/ports/ICreatePlayerUserUseCase';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { IProfileImageUploader } from '../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { ISearchPlayerUsersUseCase } from '../../application/use-cases/ports/ISearchPlayerUsersUseCase';

export interface IPlayerUserContainer {
  httpResponseHandler: IHttpResponseHandler;
  playerUserServerErrorHandler: IServerErrorHandler;
  createPlayerUserPOSTController: IController;
  createPlayerUserUseCase: ICreatePlayerUserUseCase;
  playerUserRepository: IPlayerUserRepository;
  idUniquenessValidatorService: IdUniquenessValidatorService;
  idUniquenessValidatorServiceRepository: IPlayerUserRepository;
  emailUniquenessValidatorServiceRepository: IPlayerUserRepository;
  playerUserNicknameValidationService: PlayerUserNicknameValidationService;
  emailUniquenessValidatorService: EmailUniquenessValidatorService;
  businessDateService: BusinessDateService;
  playerUserRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationService: SecurePasswordCreationService;
  passwordHashingService: IPasswordHashingService;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  profileImageUploader: IProfileImageUploader;
  searchPlayerUsersGETController: IController;
  searchPlayerUsersUseCase: ISearchPlayerUsersUseCase;
}
