import {
  BusinessDateDomainService,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserRepository,
  ITeamPlayerRepository,
  ITeamRepository,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
  TeamPlayerValidationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { IExcelManager } from '../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { ICreateTeamPlayerUseCase } from '../../application/use-cases/ports/ICreateTeamPlayerUseCase';
import { BulkCreateTeamPlayerFromExcelService } from '../services/BulkCreateTeamPlayerFromExcelService';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { IUuidGenerator } from '../../../../shared/application/uuid/ports/IUuidGenerator';

export interface ITeamPlayerContainer {
  httpResponseHandler: IHttpResponseHandler;
  excelManager: IExcelManager;
  teamPlayerServerErrorHandler: IServerErrorHandler;
  bulkCreateTeamPlayerFromExcelPOSTController: IController;
  teamPlayerRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  bulkCreateTeamPlayerFromExcelService: BulkCreateTeamPlayerFromExcelService;
  createTeamPlayerUseCase: ICreateTeamPlayerUseCase;
  teamPlayerValidationDomainService: TeamPlayerValidationDomainService;
  teamPlayerRepository: ITeamPlayerRepository;
  teamValidationDomainService: TeamValidationDomainService;
  playerValidationDomainService: PlayerUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  playerUserRepository: IPlayerUserRepository;
  teamRepository: ITeamRepository;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  uuidGenerator: IUuidGenerator;
}
