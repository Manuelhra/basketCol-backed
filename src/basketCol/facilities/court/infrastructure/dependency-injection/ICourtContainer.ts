import {
  BusinessDateService,
  GymValidationService,
  HostUserValidationService,
  ICourtRepository,
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
import { ICreateCourtUseCase } from '../../application/use-cases/ports/ICreateCourtUseCase';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { ISearchCourtsUseCase } from '../../application/use-cases/ports/ISearchCourtsUseCase';

export interface ICourtContainer {
  courtServerErrorHandler: IServerErrorHandler;
  httpResponseHandler: IHttpResponseHandler;
  createCourtPOSTController: IController;
  facilityMainImageUploader: IFacilityMainImageUploader;
  facilityBatchImageUploader: IFacilityBatchImageUploader;
  createCourtUseCase: ICreateCourtUseCase;
  hostUserValidationService: HostUserValidationService;
  hostUserRepository: IHostUserRepository;
  gymValidationService: GymValidationService;
  gymRepository: IGymRepository;
  businessDateService: BusinessDateService;
  courtRepository: ICourtRepository;
  courtRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  securePasswordCreationService: SecurePasswordCreationService;
  passwordHashingService: IPasswordHashingService;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  searchCourtsGETController: IController;
  searchCourtsUseCase: ISearchCourtsUseCase;
}
