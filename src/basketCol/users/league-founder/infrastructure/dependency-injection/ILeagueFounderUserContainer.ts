import {
  BusinessDateDomainService,
  EmailUniquenessValidatorDomainService,
  ILeagueFounderUserRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  SecurePasswordCreationDomainService,
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
  emailUniquenessValidatorDomainService: EmailUniquenessValidatorDomainService;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
  businessDateDomainService: BusinessDateDomainService;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  profileImageUploader: IProfileImageUploader;
  leagueFounderUserRouteManager: IRouteManager;
  fileSystem: IFileSystem;
}
