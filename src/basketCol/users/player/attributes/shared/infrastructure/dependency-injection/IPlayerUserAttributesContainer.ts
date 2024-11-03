import {
  BusinessDateService,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IPlayerUserDefensiveAttributesRepository,
  IPlayerUserFinishingAttributesRepository,
  IPlayerUserPhysicalAttributesRepository,
  IPlayerUserReboundingAttributesRepository,
  IPlayerUserRepository,
  IPlayerUserShootingAttributesRepository,
  IPlayerUserSkillAttributesRepository,
  PlayerUserValidationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IExcelManager } from '../../../../../../shared/infrastructure/excel/ports/IExcelManager';
import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ICreateDefensiveAttributesUseCase } from '../../../defensive/application/use-cases/ports/ICreateDefensiveAttributesUseCase';
import { ICreateFinishingAttributesUseCase } from '../../../finishing/application/use-cases/ports/ICreateFinishingAttributesUseCase';
import { ICreatePhysicalAttributesUseCase } from '../../../physical/application/use-cases/ports/ICreatePhysicalAttributesUseCase';
import { ICreateReboundingAttributesUseCase } from '../../../rebounding/application/use-cases/ports/ICreateReboundingAttributesUseCase';
import { ICreateShootingAttributesUseCase } from '../../../shooting/application/use-cases/ports/ICreateShootingAttributesUseCase';
import { ICreateSkillAttributesUseCase } from '../../../skill/application/use-cases/ports/ICreateSkillAttributesUseCase';
import { BulkCreatePlayerAttributesService } from '../services/BulkCreatePlayerAttributesService';

export interface IPlayerUserAttributesContainer {
  httpResponseHandler: IHttpResponseHandler;
  excelManager: IExcelManager;
  bulkCreatePlayerUserAttributesFromExcelPOSTController: IController;
  playerUserAttributesRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  bulkCreatePlayerAttributesService: BulkCreatePlayerAttributesService;
  createDefensiveAttributesUseCase: ICreateDefensiveAttributesUseCase;
  playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;
  createFinishingAttributesUseCase: ICreateFinishingAttributesUseCase;
  playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;
  createPhysicalAttributesUseCase: ICreatePhysicalAttributesUseCase;
  playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;
  createReboundingAttributesUseCase: ICreateReboundingAttributesUseCase;
  playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;
  createShootingAttributesUseCase: ICreateShootingAttributesUseCase;
  playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;
  createSkillAttributesUseCase: ICreateSkillAttributesUseCase;
  playerUserSkillAttributesRepository: IPlayerUserSkillAttributesRepository;
  businessDateService: BusinessDateService;
  playerUserValidationService: PlayerUserValidationService;
  playerUserRepository: IPlayerUserRepository;
  securePasswordCreationService: SecurePasswordCreationService;
  passwordHashingService: IPasswordHashingService;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService
}
