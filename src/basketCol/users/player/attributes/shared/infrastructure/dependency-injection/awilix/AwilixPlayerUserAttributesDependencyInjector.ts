import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IIdUniquenessValidatorServiceRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IPlayerUserDefensiveAttributesRepository,
  IPlayerUserFinishingAttributesRepository,
  IPlayerUserPhysicalAttributesRepository,
  IPlayerUserReboundingAttributesRepository,
  IPlayerUserRepository,
  IPlayerUserShootingAttributesRepository,
  IPlayerUserSkillAttributesRepository,
  PasswordValueObjectCreationService,
  PlayerUserValidationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { IExcelManager } from '../../../../../../../shared/infrastructure/excel/ports/IExcelManager';
import { XLSXManager } from '../../../../../../../shared/infrastructure/excel/xlsx/XLSXManager';
import { GlobFileSystem } from '../../../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { CreateDefensiveAttributesUseCase } from '../../../../defensive/application/use-cases/CreateDefensiveAttributesUseCase';
import { ICreateDefensiveAttributesUseCase } from '../../../../defensive/application/use-cases/ports/ICreateDefensiveAttributesUseCase';
import { ExpressBulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController } from '../../server/express/controllers/ExpressBulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController';
import { ExpressPlayerUserAttributesRouteManager } from '../../server/express/routes/ExpressPlayerUserAttributesRouteManager';
import { BulkCreatePlayerUserAttributeCategoriesService } from '../../services/BulkCreatePlayerUserAttributeCategoriesService';
import { IPlayerUserAttributesContainer } from '../IPlayerUserAttributesContainer';
import { MongoosePlayerUserDefensiveAttributesRepository } from '../../../../defensive/infrastructure/persistence/mongoose/MongoosePlayerUserDefensiveAttributesRepository';
import { ICreateFinishingAttributesUseCase } from '../../../../finishing/application/use-cases/ports/ICreateFinishingAttributesUseCase';
import { MongoosePlayerUserFinishingAttributesRepository } from '../../../../finishing/infrastructure/persistence/mongoose/MongoosePlayerUserFinishingAttributesRepository';
import { CreateFinishingAttributesUseCase } from '../../../../finishing/application/use-cases/CreateFinishingAttributesUseCase';
import { ICreatePhysicalAttributesUseCase } from '../../../../physical/application/use-cases/ports/ICreatePhysicalAttributesUseCase';
import { CreatePhysicalAttributesUseCase } from '../../../../physical/application/use-cases/CreatePhysicalAttributesUseCase';
import { MongoosePlayerUserPhysicalAttributesRepository } from '../../../../physical/infrastructure/persistence/mongoose/MongoosePlayerUserPhysicalAttributesRepository';
import { CreateReboundingAttributesUseCase } from '../../../../rebounding/application/use-cases/CreateReboundingAttributesUseCase';
import { ICreateReboundingAttributesUseCase } from '../../../../rebounding/application/use-cases/ports/ICreateReboundingAttributesUseCase';
import { MongoosePlayerUserReboundingAttributesRepository } from '../../../../rebounding/infrastructure/persistence/mongoose/MongoosePlayerUserReboundingAttributesRepository';
import { ICreateShootingAttributesUseCase } from '../../../../shooting/application/use-cases/ports/ICreateShootingAttributesUseCase';
import { CreateShootingAttributesUseCase } from '../../../../shooting/application/use-cases/CreateShootingAttributesUseCase';
import { MongoosePlayerUserShootingAttributesRepository } from '../../../../shooting/infrastructure/persistence/mongoose/MongoosePlayerUserShootingAttributesRepository';
import { ICreateSkillAttributesUseCase } from '../../../../skill/application/use-cases/ports/ICreateSkillAttributesUseCase';
import { CreateSkillAttributesUseCase } from '../../../../skill/application/use-cases/CreateSkillAttributesUseCase';
import { MongoosePlayerUserSkillAttributesRepository } from '../../../../skill/infrastructure/persistence/mongoose/MongoosePlayerUserSkillAttributesRepository';
import { MongoosePlayerUserRepository } from '../../../../../infrastructure/persistence/mongoose/MongoosePlayerUserRepository';
import { BcryptPasswordHashingService } from '../../../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { ExpressGetPlayerUserAttributeCategoriesGETController } from '../../server/express/controllers/ExpressGetPlayerUserAttributeCategoriesGETController';
import { IGetPlayerUserAttributeCategoriesUseCase } from '../../../application/use-cases/ports/IGetPlayerUserAttributeCategoriesUseCase';
import { GetPlayerUserAttributeCategoriesUseCase } from '../../../application/use-cases/GetPlayerUserAttributeCategoriesUseCase';

export class AwilixPlayerUserAttributesDependencyInjector
  extends AwilixDependencyInjector<IPlayerUserAttributesContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      excelManager: AwilixDependencyInjector.registerAsFunction<IExcelManager>(XLSXManager.create).singleton(),
      bulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressBulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController.create).singleton(),
      playerUserAttributesRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressPlayerUserAttributesRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      bulkCreatePlayerUserAttributeCategoriesService: AwilixDependencyInjector.registerAsFunction<BulkCreatePlayerUserAttributeCategoriesService>(BulkCreatePlayerUserAttributeCategoriesService.create).singleton(),
      createDefensiveAttributesUseCase: AwilixDependencyInjector.registerAsFunction<ICreateDefensiveAttributesUseCase>((cradle: IPlayerUserAttributesContainer) => CreateDefensiveAttributesUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.playerUserDefensiveAttributesRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        playerUserValidationService: cradle.playerUserValidationService,
        playerUserDefensiveAttributesRepository: cradle.playerUserDefensiveAttributesRepository,
      })),
      playerUserDefensiveAttributesRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserDefensiveAttributesRepository>(MongoosePlayerUserDefensiveAttributesRepository.create).singleton(),
      createFinishingAttributesUseCase: AwilixDependencyInjector.registerAsFunction<ICreateFinishingAttributesUseCase>((cradle: IPlayerUserAttributesContainer) => CreateFinishingAttributesUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.playerUserFinishingAttributesRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        playerUserValidationService: cradle.playerUserValidationService,
        playerUserFinishingAttributesRepository: cradle.playerUserFinishingAttributesRepository,
      })),
      playerUserFinishingAttributesRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserFinishingAttributesRepository>(MongoosePlayerUserFinishingAttributesRepository.create).singleton(),
      createPhysicalAttributesUseCase: AwilixDependencyInjector.registerAsFunction<ICreatePhysicalAttributesUseCase>((cradle: IPlayerUserAttributesContainer) => CreatePhysicalAttributesUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.playerUserPhysicalAttributesRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        playerUserValidationService: cradle.playerUserValidationService,
        playerUserPhysicalAttributesRepository: cradle.playerUserPhysicalAttributesRepository,
      })),
      playerUserPhysicalAttributesRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserPhysicalAttributesRepository>(MongoosePlayerUserPhysicalAttributesRepository.create).singleton(),
      createReboundingAttributesUseCase: AwilixDependencyInjector.registerAsFunction<ICreateReboundingAttributesUseCase>((cradle: IPlayerUserAttributesContainer) => CreateReboundingAttributesUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.playerUserReboundingAttributesRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        playerUserValidationService: cradle.playerUserValidationService,
        playerUserReboundingAttributesRepository: cradle.playerUserReboundingAttributesRepository,
      })),
      playerUserReboundingAttributesRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserReboundingAttributesRepository>(MongoosePlayerUserReboundingAttributesRepository.create).singleton(),
      createShootingAttributesUseCase: AwilixDependencyInjector.registerAsFunction<ICreateShootingAttributesUseCase>((cradle: IPlayerUserAttributesContainer) => CreateShootingAttributesUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.playerUserShootingAttributesRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        playerUserValidationService: cradle.playerUserValidationService,
        playerUserShootingAttributesRepository: cradle.playerUserShootingAttributesRepository,
      })),
      playerUserShootingAttributesRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserShootingAttributesRepository>(MongoosePlayerUserShootingAttributesRepository.create).singleton(),
      createSkillAttributesUseCase: AwilixDependencyInjector.registerAsFunction<ICreateSkillAttributesUseCase>((cradle: IPlayerUserAttributesContainer) => CreateSkillAttributesUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.playerUserSkillAttributesRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        playerUserValidationService: cradle.playerUserValidationService,
        playerUserSkillAttributesRepository: cradle.playerUserSkillAttributesRepository,
      })),
      playerUserSkillAttributesRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserSkillAttributesRepository>(MongoosePlayerUserSkillAttributesRepository.create).singleton(),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      playerUserValidationService: AwilixDependencyInjector.registerAsFunction<PlayerUserValidationService>(PlayerUserValidationService.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
      getPlayerUserAttributeCategoriesGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressGetPlayerUserAttributeCategoriesGETController.create).singleton(),
      getPlayerUserAttributeCategoriesUseCase: AwilixDependencyInjector.registerAsFunction<IGetPlayerUserAttributeCategoriesUseCase>(GetPlayerUserAttributeCategoriesUseCase.create).singleton(),
    });
  }

  public static create(): AwilixPlayerUserAttributesDependencyInjector {
    return new AwilixPlayerUserAttributesDependencyInjector();
  }
}
