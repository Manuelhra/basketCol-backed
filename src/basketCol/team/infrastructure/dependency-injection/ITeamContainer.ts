import {
  BusinessDateDomainService,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  ITeamAllTimeStatsRepository,
  ITeamFounderUserRepository,
  ITeamRepository,
  SecurePasswordCreationDomainService,
  TeamFounderUserValidationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../shared/application/http/ports/IHttpResponseHandler';
import { IFileSystem } from '../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../shared/infrastructure/server/routes/IRouteManager';
import { ICreateTeamUseCase } from '../../application/use-cases/ports/ICreateTeamUseCase';
import { IUuidGenerator } from '../../../shared/application/uuid/ports/IUuidGenerator';
import { ICreateTeamAllTimeStatsUseCase } from '../../all-time-stats/application/use-cases/ports/ICreateTeamAllTimeStatsUseCase';
import { IBatchGalleryImagesUploader } from '../../../shared/application/file-upload/images/ports/IBatchGalleryImagesUploader';
import { IMainImageUploader } from '../../../shared/application/file-upload/images/ports/IMainImageUploader';
import { ILogoUploader } from '../../../shared/application/file-upload/images/ports/ILogoUploader';
import { IFindTeamByIdUseCase } from '../../application/use-cases/ports/IFindTeamByIdUseCase';
import { ISearchAllTeamsUseCase } from '../../application/use-cases/ports/ISearchAllTeamsUseCase';

export interface ITeamContainer {
  httpResponseHandler: IHttpResponseHandler;
  teamServerErrorHandler: IServerErrorHandler;
  createTeamPOSTController: IController;
  logoUploader: ILogoUploader;
  mainImageUploader: IMainImageUploader;
  batchGalleryImagesUploader: IBatchGalleryImagesUploader;
  createTeamUseCase: ICreateTeamUseCase;
  teamRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  teamFounderUserValidationDomainService: TeamFounderUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  teamRepository: ITeamRepository;
  createTeamAllTimeStatsUseCase: ICreateTeamAllTimeStatsUseCase;
  teamAllTimeStatsRepository: ITeamAllTimeStatsRepository;
  uuidGenerator: IUuidGenerator;
  teamValidationDomainService: TeamValidationDomainService;
  tFURepository: ITeamFounderUserRepository;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  findTeamByIdGETController: IController;
  findTeamByIdUseCase: IFindTeamByIdUseCase;
  searchAllTeamsGETController: IController;
  searchAllTeamsUseCase: ISearchAllTeamsUseCase;
}
