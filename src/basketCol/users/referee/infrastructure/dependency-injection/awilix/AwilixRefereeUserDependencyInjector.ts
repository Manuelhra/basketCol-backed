import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  IEmailUniquenessValidatorServiceRepository,
  IIdUniquenessValidatorServiceRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IRefereeUserRepository,
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
import { ExpressPlayerUserRouteManager } from '../../../../player/infrastructure/server/express/routes/ExpressPlayerUserRouteManager';
import { CreateRefereeUserUseCase } from '../../../application/use-cases/CreateRefereeUserUseCase';
import { ICreateRefereeUserUseCase } from '../../../application/use-cases/ports/ICreateRefereeUserUseCase';
import { ExpressCreateRefereeUserPOSTController } from '../../server/express/controllers/ExpressCreateRefereeUserPOSTController';
import { ExpressRefereeUserServerErrorHandler } from '../../server/express/ExpressRefereeUserServerErrorHandler';
import { IRefereeUserContainer } from '../IRefereeUserContainer';
import { MongooseRefereeUserRepository } from '../../persistence/mongoose/MongooseRefereeUserRepository';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { IProfileImageUploader } from '../../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { S3ProfileImageUploader } from '../../../../shared/infrastructure/file-upload/images/aws/S3ProfileImageUploader';

export class AwilixRefereeUserDependencyInjector extends AwilixDependencyInjector<IRefereeUserContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      refereeUserRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressPlayerUserRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      refereeUserServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressRefereeUserServerErrorHandler.create).singleton(),
      createRefereeUserPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateRefereeUserPOSTController.create).singleton(),
      createRefereeUserUseCase: AwilixDependencyInjector.registerAsFunction<ICreateRefereeUserUseCase>((cradle: IRefereeUserContainer) => CreateRefereeUserUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.refereeUserRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        emailUniquenessValidatorService: EmailUniquenessValidatorService.create({
          emailUniquenessValidatorServiceRepository: cradle.refereeUserRepository as IEmailUniquenessValidatorServiceRepository,
        }),
        refereeUserRepository: cradle.refereeUserRepository,
      })),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      refereeUserRepository: AwilixDependencyInjector.registerAsFunction<IRefereeUserRepository>(MongooseRefereeUserRepository.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      profileImageUploader: AwilixDependencyInjector.registerAsFunction<IProfileImageUploader>(() => S3ProfileImageUploader.create({
        folderPath: 'referee',
      })).singleton(),
    });
  }

  public static create(): AwilixRefereeUserDependencyInjector {
    return new AwilixRefereeUserDependencyInjector();
  }
}
