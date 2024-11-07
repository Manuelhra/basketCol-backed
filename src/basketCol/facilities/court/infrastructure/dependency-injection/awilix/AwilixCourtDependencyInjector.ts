import {
  BusinessDateService,
  GymValidationService,
  HostUserValidationService,
  ICourtRepository,
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
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressCreateCourtPOSTController } from '../../server/express/controllers/ExpressCreateCourtPOSTController';
import { ExpressCourtServerErrorHandler } from '../../server/express/ExpressCourtServerErrorHandler';
import { ICourtContainer } from '../ICourtContainer';
import { ICreateCourtUseCase } from '../../../application/use-cases/ports/ICreateCourtUseCase';
import { CreateCourtUseCase } from '../../../application/use-cases/CreateCourtUseCase';
import { MongooseGymRepository } from '../../../../gym/infrastructure/persistence/mongoose/MongooseGymRepository';
import { MongooseCourtRepository } from '../../persistence/mongoose/MongooseCourtRepository';
import { MongooseHostUserRepository } from '../../../../../users/host/infrastructure/persistence/mongoose/MongooseHostUserRepository';
import { IFacilityMainImageUploader } from '../../../../shared/application/file-upload/images/ports/IFacilityMainImageUploader';
import { S3FacilityMainImageUploader } from '../../../../shared/infrastructure/file-upload/images/aws/S3FacilityMainImageUploader';
import { IFacilityBatchImageUploader } from '../../../../shared/application/file-upload/images/ports/IFacilityBatchImageUploader';
import { S3FacilityBatchImageUploader } from '../../../../shared/infrastructure/file-upload/images/aws/S3FacilityBatchImageUploader';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ExpressCourtRouteManager } from '../../server/express/routes/ExpressCourtRouteManager';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { GlobFileSystem } from '../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { ExpressSearchCourtsGETController } from '../../server/express/controllers/ExpressSearchCourtsGETController';
import { ISearchCourtsUseCase } from '../../../application/use-cases/ports/ISearchCourtsUseCase';
import { SearchCourtsUseCase } from '../../../application/use-cases/SearchCourtsUseCase';

export class AwilixCourtDependencyInjector extends AwilixDependencyInjector<ICourtContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      courtRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressCourtRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      courtServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressCourtServerErrorHandler.create).singleton(),
      createCourtPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateCourtPOSTController.create).singleton(),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      createCourtUseCase: AwilixDependencyInjector.registerAsFunction<ICreateCourtUseCase>((cradle: ICourtContainer) => CreateCourtUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.courtRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        courtRepository: cradle.courtRepository,
        gymValidationService: cradle.gymValidationService,
        hostUserValidationService: cradle.hostUserValidationService,
      })),
      courtRepository: AwilixDependencyInjector.registerAsFunction<ICourtRepository>(MongooseCourtRepository.create).singleton(),
      gymValidationService: AwilixDependencyInjector.registerAsFunction<GymValidationService>(GymValidationService.create).singleton(),
      gymRepository: AwilixDependencyInjector.registerAsFunction<IGymRepository>(MongooseGymRepository.create).singleton(),
      hostUserValidationService: AwilixDependencyInjector.registerAsFunction<HostUserValidationService>(HostUserValidationService.create).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsFunction<IHostUserRepository>(MongooseHostUserRepository.create).singleton(),
      facilityMainImageUploader: AwilixDependencyInjector.registerAsFunction<IFacilityMainImageUploader>(() => S3FacilityMainImageUploader.create({
        folderPath: 'court',
      })),
      facilityBatchImageUploader: AwilixDependencyInjector.registerAsFunction<IFacilityBatchImageUploader>(() => S3FacilityBatchImageUploader.create({
        folderPath: 'court',
      })),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
      searchCourtsGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressSearchCourtsGETController.create).singleton(),
      searchCourtsUseCase: AwilixDependencyInjector.registerAsFunction<ISearchCourtsUseCase>(SearchCourtsUseCase.create).singleton(),
    });
  }

  public static create(): AwilixCourtDependencyInjector {
    return new AwilixCourtDependencyInjector();
  }
}
