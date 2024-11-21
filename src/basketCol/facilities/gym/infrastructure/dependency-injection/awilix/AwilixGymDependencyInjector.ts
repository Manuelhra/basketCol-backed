import {
  BusinessDateDomainService,
  HostUserValidationDomainService,
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
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { ExpressSearchAllGymsGETController } from '../../server/express/controllers/ExpressSearchAllGymsGETController';
import { ISearchAllGymsUseCase } from '../../../application/use-cases/ports/ISearchAllGymsUseCase';
import { SearchAllGymsUseCase } from '../../../application/use-cases/SearchAllGymsUseCase';
import { IBatchGalleryImagesUploader } from '../../../../../shared/application/file-upload/images/ports/IBatchGalleryImagesUploader';
import { IMainImageUploader } from '../../../../../shared/application/file-upload/images/ports/IMainImageUploader';
import { S3BatchGalleryImagesUploader } from '../../../../../shared/infrastructure/file-upload/aws/S3BatchGalleryImagesUploader';
import { S3MainImageUploader } from '../../../../../shared/infrastructure/file-upload/aws/S3MainImageUploader';

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
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      createGymUseCase: AwilixDependencyInjector.registerAsFunction<ICreateGymUseCase>((cradle: IGymContainer) => CreateGymUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.gymRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        gymRepository: cradle.gymRepository,
        hostUserValidationDomainService: cradle.hostUserValidationDomainService,
      })),
      gymRepository: AwilixDependencyInjector.registerAsFunction<IGymRepository>(MongooseGymRepository.create).singleton(),
      hostUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<HostUserValidationDomainService>(HostUserValidationDomainService.create).singleton(),
      hostUserRepository: AwilixDependencyInjector.registerAsFunction<IHostUserRepository>(MongooseHostUserRepository.create).singleton(),
      mainImageUploader: AwilixDependencyInjector.registerAsFunction<IMainImageUploader>(() => S3MainImageUploader.create({
        folderPath: 'gym',
      })),
      batchGalleryImagesUploader: AwilixDependencyInjector.registerAsFunction<IBatchGalleryImagesUploader>(() => S3BatchGalleryImagesUploader.create({
        folderPath: 'gym',
      })),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      searchAllGymsGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressSearchAllGymsGETController.create).singleton(),
      searchAllGymsUseCase: AwilixDependencyInjector.registerAsFunction<ISearchAllGymsUseCase>(SearchAllGymsUseCase.create).singleton(),
    });
  }

  public static create(): AwilixGymDependencyInjector {
    return new AwilixGymDependencyInjector();
  }
}
