import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserRepository,
  ITeamPlayerRepository,
  ITeamRepository,
  PasswordValueObjectCreationDomainService,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
  TeamPlayerValidationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { CreateTeamPlayerUseCase } from '../../../application/use-cases/CreateTeamPlayerUseCase';
import { ICreateTeamPlayerUseCase } from '../../../application/use-cases/ports/ICreateTeamPlayerUseCase';
import { ExpressBulkCreateTeamPlayerFromExcelPOSTController } from '../../server/express/controllers/ExpressBulkCreateTeamPlayerFromExcelPOSTController';
import { ExpressTeamPlayerServerErrorHandler } from '../../server/express/ExpressTeamPlayerServerErrorHandler';
import { ExpressTeamPlayerRouteManager } from '../../server/express/routes/ExpressTeamPlayerRouteManager';
import { BulkCreateTeamPlayerFromExcelService } from '../../services/BulkCreateTeamPlayerFromExcelService';
import { ITeamPlayerContainer } from '../ITeamPlayerContainer';
import { MongoosePlayerUserRepository } from '../../../../../users/player/infrastructure/persistence/mongoose/MongoosePlayerUserRepository';
import { MongooseTeamRepository } from '../../../../infrastructure/persistence/mongoose/MongooseTeamRepository';
import { MongooseTeamPlayerRepository } from '../../persistence/mongoose/MongooseTeamPlayerRepository';
import { IExcelManager } from '../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { XLSXManager } from '../../../../../shared/infrastructure/file-upload/excel/xlsx/XLSXManager';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { IUuidGenerator } from '../../../../../shared/application/uuid/ports/IUuidGenerator';
import { UuidV4Generator } from '../../../../../shared/infrastructure/uuid/UuidV4Generator';

export class AwilixTeamPlayerDependencyInjector extends AwilixDependencyInjector<ITeamPlayerContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      teamPlayerRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressTeamPlayerRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      teamPlayerServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressTeamPlayerServerErrorHandler.create).singleton(),
      bulkCreateTeamPlayerFromExcelPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressBulkCreateTeamPlayerFromExcelPOSTController.create).singleton(),
      bulkCreateTeamPlayerFromExcelService: AwilixDependencyInjector.registerAsFunction<BulkCreateTeamPlayerFromExcelService>(BulkCreateTeamPlayerFromExcelService.create).singleton(),
      createTeamPlayerUseCase: AwilixDependencyInjector.registerAsFunction<ICreateTeamPlayerUseCase>((cradle: ITeamPlayerContainer) => CreateTeamPlayerUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.teamPlayerRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        playerValidationDomainService: cradle.playerValidationDomainService,
        teamPlayerRepository: cradle.teamPlayerRepository,
        teamPlayerValidationDomainService: cradle.teamPlayerValidationDomainService,
        teamValidationDomainService: cradle.teamValidationDomainService,
      })),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      teamRepository: AwilixDependencyInjector.registerAsFunction<ITeamRepository>(MongooseTeamRepository.create).singleton(),
      playerValidationDomainService: AwilixDependencyInjector.registerAsFunction<PlayerUserValidationDomainService>(PlayerUserValidationDomainService.create).singleton(),
      teamPlayerRepository: AwilixDependencyInjector.registerAsFunction<ITeamPlayerRepository>(MongooseTeamPlayerRepository.create).singleton(),
      teamPlayerValidationDomainService: AwilixDependencyInjector.registerAsFunction<TeamPlayerValidationDomainService>(TeamPlayerValidationDomainService.create).singleton(),
      teamValidationDomainService: AwilixDependencyInjector.registerAsFunction<TeamValidationDomainService>(TeamValidationDomainService.create).singleton(),
      excelManager: AwilixDependencyInjector.registerAsFunction<IExcelManager>(XLSXManager.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      uuidGenerator: AwilixDependencyInjector.registerAsFunction<IUuidGenerator>(UuidV4Generator.create).singleton(),
    });
  }

  public static create(): AwilixTeamPlayerDependencyInjector {
    return new AwilixTeamPlayerDependencyInjector();
  }
}
