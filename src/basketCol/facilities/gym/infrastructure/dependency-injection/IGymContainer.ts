import {
  BusinessDateDomainService,
  HostUserValidationDomainService,
  IGymRepository,
  IHostUserRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateGymUseCase } from '../../application/use-cases/ports/ICreateGymUseCase';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { ISearchAllGymsUseCase } from '../../application/use-cases/ports/ISearchAllGymsUseCase';
import { IBatchGalleryImagesUploader } from '../../../../shared/application/file-upload/images/ports/IBatchGalleryImagesUploader';
import { IMainImageUploader } from '../../../../shared/application/file-upload/images/ports/IMainImageUploader';

export interface IGymContainer {
  httpResponseHandler: IHttpResponseHandler;
  gymServerErrorHandler: IServerErrorHandler;
  createGymPOSTController: IController;
  mainImageUploader: IMainImageUploader;
  batchGalleryImagesUploader: IBatchGalleryImagesUploader;
  createGymUseCase: ICreateGymUseCase;
  hostUserValidationDomainService: HostUserValidationDomainService;
  hostUserRepository: IHostUserRepository;
  businessDateDomainService: BusinessDateDomainService;
  gymRepository: IGymRepository;
  gymRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  searchAllGymsGETController: IController;
  searchAllGymsUseCase: ISearchAllGymsUseCase;
}
