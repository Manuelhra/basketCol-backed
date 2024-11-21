import {
  BusinessDateDomainService,
  GymValidationDomainService,
  HostUserValidationDomainService,
  ICourtRepository,
  IGymRepository,
  IHostUserRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ICreateCourtUseCase } from '../../application/use-cases/ports/ICreateCourtUseCase';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { ISearchAllCourtsUseCase } from '../../application/use-cases/ports/ISearchAllCourtsUseCase';
import { IMainImageUploader } from '../../../../shared/application/file-upload/images/ports/IMainImageUploader';
import { IBatchGalleryImagesUploader } from '../../../../shared/application/file-upload/images/ports/IBatchGalleryImagesUploader';

export interface ICourtContainer {
  courtServerErrorHandler: IServerErrorHandler;
  httpResponseHandler: IHttpResponseHandler;
  createCourtPOSTController: IController;
  mainImageUploader: IMainImageUploader;
  batchGalleryImagesUploader: IBatchGalleryImagesUploader;
  createCourtUseCase: ICreateCourtUseCase;
  hostUserValidationDomainService: HostUserValidationDomainService;
  hostUserRepository: IHostUserRepository;
  gymValidationDomainService: GymValidationDomainService;
  gymRepository: IGymRepository;
  businessDateDomainService: BusinessDateDomainService;
  courtRepository: ICourtRepository;
  courtRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  searchAllCourtsGETController: IController;
  searchAllCourtsUseCase: ISearchAllCourtsUseCase;
}
