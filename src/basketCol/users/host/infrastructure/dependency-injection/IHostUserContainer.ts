import {
  BusinessDateService,
  IHostUserRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { ICreateHostUserUseCase } from '../../application/use-cases/ports/ICreateHostUserUseCase';
import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { IHostUserConfigFactory } from '../../application/ports/IHostUserConfigFactory';
import { IProfileImageUploader } from '../../../shared/application/ports/IProfileImageUploader';

export interface IHostUserContainer {
  businessDateService: BusinessDateService;
  createHostUserUseCase: ICreateHostUserUseCase;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  fileSystem: IFileSystem;
  hostUserConfigFactory: IHostUserConfigFactory;
  createHostUserPOSTController: IController;
  hostUserRepository: IHostUserRepository;
  hostUserRouteManager: IRouteManager;
  httpResponseHandler: IHttpResponseHandler;
  passwordHashingService: IPasswordHashingService;
  securePasswordCreationService: SecurePasswordCreationService;
  hostUserServerErrorHandler: IServerErrorHandler;
  profileImageUploader: IProfileImageUploader;
}
