import {
  BusinessDateDomainService,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IRefereeUserRepository,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateRefereeUserUseCase } from '../../application/use-cases/ports/ICreateRefereeUserUseCase';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { IProfileImageUploader } from '../../../shared/application/file-upload/images/ports/IProfileImageUploader';

export interface IRefereeUserContainer {
  httpResponseHandler: IHttpResponseHandler;
  refereeUserServerErrorHandler: IServerErrorHandler;
  createRefereeUserPOSTController: IController;
  createRefereeUserUseCase: ICreateRefereeUserUseCase;
  businessDateDomainService: BusinessDateDomainService;
  refereeUserRepository: IRefereeUserRepository;
  refereeUserRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  profileImageUploader: IProfileImageUploader;
}
