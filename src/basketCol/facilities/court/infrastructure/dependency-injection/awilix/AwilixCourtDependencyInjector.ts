import {
  BusinessDateDomainService,
  GymValidationDomainService,
  HostUserValidationDomainService,
  ICourtRepository,
  IdUniquenessValidatorDomainService,
  IGymRepository,
  IHostUserRepository,
  IIdUniquenessValidatorDomainServiceRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  PasswordValueObjectCreationDomainService,
  SecurePasswordCreationDomainService,
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
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ExpressCourtRouteManager } from '../../server/express/routes/ExpressCourtRouteManager';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { GlobFileSystem } from '../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { ExpressSearchAllCourtsGETController } from '../../server/express/controllers/ExpressSearchAllCourtsGETController';
import { ISearchAllCourtsUseCase } from '../../../application/use-cases/ports/ISearchAllCourtsUseCase';
import { SearchAllCourtsUseCase } from '../../../application/use-cases/SearchAllCourtsUseCase';
import { IMainImageUploader } from '../../../../../shared/application/file-upload/images/ports/IMainImageUploader';
import { IBatchGalleryImagesUploader } from '../../../../../shared/application/file-upload/images/ports/IBatchGalleryImagesUploader';
import { S3MainImageUploader } from '../../../../../shared/infrastructure/file-upload/aws/S3MainImageUploader';
import { S3BatchGalleryImagesUploader } from '../../../../../shared/infrastructure/file-upload/aws/S3BatchGalleryImagesUploader';

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
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      createCourtUseCase: AwilixDependencyInjector.registerAsFunction<ICreateCourtUseCase>((cradle: ICourtContainer) => CreateCourtUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.courtRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        courtRepository: cradle.courtRepository,
        gymValidationDomainService: cradle.gymValidationDomainService,
        hostUserValidationDomainService: cradle.hostUserValidationDomainService,
      })).singleton(),
      courtRepository: AwilixDependencyInjector.registerAsFunction<ICourtRepository>(MongooseCourtRepository.create).singleton(),
      gymValidationDomainService: AwilixDependencyInjector.registerAsFunction<GymValidationDomainService>(GymValidationDomainService.create).singleton(),
      gymRepository: AwilixDependencyInjector.registerAsFunction<IGymRepository>(MongooseGymRepository.create).singleton(),
      hostUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<HostUserValidationDomainService>(HostUserValidationDomainService.create).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsFunction<IHostUserRepository>(MongooseHostUserRepository.create).singleton(),
      mainImageUploader: AwilixDependencyInjector.registerAsFunction<IMainImageUploader>(() => S3MainImageUploader.create({
        folderPath: 'court',
      })),
      batchGalleryImagesUploader: AwilixDependencyInjector.registerAsFunction<IBatchGalleryImagesUploader>(() => S3BatchGalleryImagesUploader.create({
        folderPath: 'court',
      })),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      searchAllCourtsGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressSearchAllCourtsGETController.create).singleton(),
      searchAllCourtsUseCase: AwilixDependencyInjector.registerAsFunction<ISearchAllCourtsUseCase>(SearchAllCourtsUseCase.create).singleton(),
    });
  }

  public static create(): AwilixCourtDependencyInjector {
    return new AwilixCourtDependencyInjector();
  }
}
