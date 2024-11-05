import {
  BusinessDateService,
  HostUserValidationService,
  IdUniquenessValidatorService,
  IGymRepository,
  IHostUserRepository,
  IIdUniquenessValidatorServiceRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  PasswordValueObjectCreationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ExpressCreateGymPOSTController } from '../../server/express/controllers/ExpressCreateGymPOSTController';
import { ExpressGymServerErrorHandler } from '../../server/express/ExpressGymServerErrorHandler';
import { ExpressGymRouteManager } from '../../server/express/routes/ExpressGymRouteManager';
import { IGymContainer } from '../IGymContainer';
import { ICreateGymUseCase } from '../../../application/use-cases/ports/ICreateGymUseCase';
import { CreateGymUseCase } from '../../../application/use-cases/CreateGymUseCase';
import { MongooseGymRepository } from '../../persistence/mongoose/MongooseGymRepository';
import { MongooseHostUserRepository } from '../../../../../users/host/infrastructure/persistence/mongoose/MongooseHostUserRepository';
import { IFacilityMainImageUploader } from '../../../../shared/application/file-upload/images/ports/IFacilityMainImageUploader';
import { S3FacilityMainImageUploader } from '../../../../shared/infrastructure/file-upload/images/aws/S3FacilityMainImageUploader';
import { IFacilityBatchImageUploader } from '../../../../shared/application/file-upload/images/ports/IFacilityBatchImageUploader';
import { S3FacilityBatchImageUploader } from '../../../../shared/infrastructure/file-upload/images/aws/S3FacilityBatchImageUploader';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';

export class AwilixGymDependencyInjector extends AwilixDependencyInjector<IGymContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      gymRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressGymRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      gymServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressGymServerErrorHandler.create).singleton(),
      createGymPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateGymPOSTController.create).singleton(),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      createGymUseCase: AwilixDependencyInjector.registerAsFunction<ICreateGymUseCase>((cradle: IGymContainer) => CreateGymUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.gymRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        gymRepository: cradle.gymRepository,
        hostUserValidationService: cradle.hostUserValidationService,
      })),
      gymRepository: AwilixDependencyInjector.registerAsFunction<IGymRepository>(MongooseGymRepository.create).singleton(),
      hostUserValidationService: AwilixDependencyInjector.registerAsFunction<HostUserValidationService>(HostUserValidationService.create).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsFunction<IHostUserRepository>(MongooseHostUserRepository.create).singleton(),
      facilityMainImageUploader: AwilixDependencyInjector.registerAsFunction<IFacilityMainImageUploader>(() => S3FacilityMainImageUploader.create({
        folderPath: 'gym',
      })),
      facilityBatchImageUploader: AwilixDependencyInjector.registerAsFunction<IFacilityBatchImageUploader>(() => S3FacilityBatchImageUploader.create({
        folderPath: 'gym',
      })),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
    });
  }

  public static create(): AwilixGymDependencyInjector {
    return new AwilixGymDependencyInjector();
  }
}
