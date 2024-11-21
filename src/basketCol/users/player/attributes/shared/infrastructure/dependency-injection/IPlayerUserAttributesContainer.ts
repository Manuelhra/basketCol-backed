import {
  BusinessDateDomainService,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserDefensiveAttributesRepository,
  IPlayerUserFinishingAttributesRepository,
  IPlayerUserPhysicalAttributesRepository,
  IPlayerUserReboundingAttributesRepository,
  IPlayerUserRepository,
  IPlayerUserShootingAttributesRepository,
  IPlayerUserSkillAttributesRepository,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ICreateDefensiveAttributesUseCase } from '../../../defensive/application/use-cases/ports/ICreateDefensiveAttributesUseCase';
import { ICreateFinishingAttributesUseCase } from '../../../finishing/application/use-cases/ports/ICreateFinishingAttributesUseCase';
import { ICreatePhysicalAttributesUseCase } from '../../../physical/application/use-cases/ports/ICreatePhysicalAttributesUseCase';
import { ICreateReboundingAttributesUseCase } from '../../../rebounding/application/use-cases/ports/ICreateReboundingAttributesUseCase';
import { ICreateShootingAttributesUseCase } from '../../../shooting/application/use-cases/ports/ICreateShootingAttributesUseCase';
import { ICreateSkillAttributesUseCase } from '../../../skill/application/use-cases/ports/ICreateSkillAttributesUseCase';
import { BulkCreatePlayerUserAttributeCategoriesFromExcelService } from '../services/BulkCreatePlayerUserAttributeCategoriesFromExcelService';
import { IGetPlayerUserAttributeCategoriesUseCase } from '../../application/use-cases/ports/IGetPlayerUserAttributeCategoriesUseCase';
import { IExcelManager } from '../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';

export interface IPlayerUserAttributesContainer {
  httpResponseHandler: IHttpResponseHandler;
  excelManager: IExcelManager;
  bulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController: IController;
  playerUserAttributesRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  bulkCreatePlayerUserAttributeCategoriesFromExcelService: BulkCreatePlayerUserAttributeCategoriesFromExcelService;
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
  businessDateDomainService: BusinessDateDomainService;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  playerUserRepository: IPlayerUserRepository;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService
  getPlayerUserAttributeCategoriesGETController: IController;
  getPlayerUserAttributeCategoriesUseCase: IGetPlayerUserAttributeCategoriesUseCase;
}
