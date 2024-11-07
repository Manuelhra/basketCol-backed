import {
  BusinessDateService,
  HostUserValidationService,
  IGymRepository,
  IHostUserRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { IFacilityBatchImageUploader } from '../../../shared/application/file-upload/images/ports/IFacilityBatchImageUploader';
import { IFacilityMainImageUploader } from '../../../shared/application/file-upload/images/ports/IFacilityMainImageUploader';
import { ICreateGymUseCase } from '../../application/use-cases/ports/ICreateGymUseCase';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { ISearchGymsUseCase } from '../../application/use-cases/ports/ISearchGymsUseCase';

export interface IGymContainer {
  httpResponseHandler: IHttpResponseHandler;
  gymServerErrorHandler: IServerErrorHandler;
  createGymPOSTController: IController;
  facilityMainImageUploader: IFacilityMainImageUploader;
  facilityBatchImageUploader: IFacilityBatchImageUploader;
  createGymUseCase: ICreateGymUseCase;
  hostUserValidationService: HostUserValidationService;
  hostUserRepository: IHostUserRepository;
  businessDateService: BusinessDateService;
  gymRepository: IGymRepository;
  gymRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationService: SecurePasswordCreationService;
  passwordHashingService: IPasswordHashingService;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  searchGymsGETController: IController;
  searchGymsUseCase: ISearchGymsUseCase;
}
