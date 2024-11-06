import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  ILeagueFounderUserRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateLeagueFounderUserUseCase } from '../../application/use-cases/ports/ICreateLeagueFounderUserUseCase';
import { IProfileImageUploader } from '../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';

export interface ILeagueFounderUserContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueFounderUserServerErrorHandler: IServerErrorHandler;
  createLeagueFounderUserPOSTController: IController;
  createLeagueFounderUserUseCase: ICreateLeagueFounderUserUseCase;
  emailUniquenessValidatorService: EmailUniquenessValidatorService;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
  businessDateService: BusinessDateService;
  securePasswordCreationService: SecurePasswordCreationService;
  passwordHashingService: IPasswordHashingService;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  profileImageUploader: IProfileImageUploader;
  leagueFounderUserRouteManager: IRouteManager;
  fileSystem: IFileSystem;
}
