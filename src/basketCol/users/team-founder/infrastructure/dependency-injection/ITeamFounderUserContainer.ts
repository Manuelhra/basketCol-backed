import {
  BusinessDateService,
  ITeamFounderUserRepository,
  SecurePasswordCreationService,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IProfileImageUploader } from '../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { ICreateTeamFounderUserUseCase } from '../../application/use-cases/ports/ICreateTeamFounderUserUseCase';

export interface ITeamFounderUserContainer {
  httpResponseHandler: IHttpResponseHandler;
  teamFounderUserServerErrorHandler: IServerErrorHandler;
  createTeamFounderUserPOSTController: IController;
  createTeamFounderUserUseCase: ICreateTeamFounderUserUseCase;
  businessDateService: BusinessDateService;
  teamFounderUserRepository: ITeamFounderUserRepository;
  teamFounderUserRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationService: SecurePasswordCreationService;
  passwordHashingService: IPasswordHashingService;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  profileImageUploader: IProfileImageUploader;
}
