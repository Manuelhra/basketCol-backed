import {
  BusinessDateDomainService,
  ITeamFounderUserRepository,
  SecurePasswordCreationDomainService,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
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
  businessDateDomainService: BusinessDateDomainService;
  teamFounderUserRepository: ITeamFounderUserRepository;
  teamFounderUserRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  profileImageUploader: IProfileImageUploader;
}
