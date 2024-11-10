import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  IEmailUniquenessValidatorServiceRepository,
  IIdUniquenessValidatorServiceRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  ITeamFounderUserRepository,
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
import { CreateTeamFounderUserUseCase } from '../../../application/use-cases/CreateTeamFounderUserUseCase';
import { ICreateTeamFounderUserUseCase } from '../../../application/use-cases/ports/ICreateTeamFounderUserUseCase';
import { ExpressCreateTeamFounderUserPOSTController } from '../../server/express/controllers/ExpressCreateTeamFounderUserPOSTController';
import { ExpressTeamFounderUserServerErrorHandler } from '../../server/express/ExpressTeamFounderUserServerErrorHandler';
import { ITeamFounderUserContainer } from '../ITeamFounderUserContainer';
import { MongooseTeamFounderUserRepository } from '../../persistence/mongoose/MongooseTeamFounderUserRepository';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { IProfileImageUploader } from '../../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { S3ProfileImageUploader } from '../../../../shared/infrastructure/file-upload/images/aws/S3ProfileImageUploader';

export class AwilixTeamFounderUserDependencyInjector extends AwilixDependencyInjector<ITeamFounderUserContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      teamFounderUserRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressPlayerUserRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      teamFounderUserServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressTeamFounderUserServerErrorHandler.create).singleton(),
      createTeamFounderUserPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateTeamFounderUserPOSTController.create).singleton(),
      createTeamFounderUserUseCase: AwilixDependencyInjector.registerAsFunction<ICreateTeamFounderUserUseCase>((cradle: ITeamFounderUserContainer) => CreateTeamFounderUserUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.teamFounderUserRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        emailUniquenessValidatorService: EmailUniquenessValidatorService.create({
          emailUniquenessValidatorServiceRepository: cradle.teamFounderUserRepository as IEmailUniquenessValidatorServiceRepository,
        }),
        teamFounderUserRepository: cradle.teamFounderUserRepository,
      })),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      teamFounderUserRepository: AwilixDependencyInjector.registerAsFunction<ITeamFounderUserRepository>(MongooseTeamFounderUserRepository.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      profileImageUploader: AwilixDependencyInjector.registerAsFunction<IProfileImageUploader>(() => S3ProfileImageUploader.create({
        folderPath: 'teamFounder',
      })).singleton(),
    });
  }

  public static create(): AwilixTeamFounderUserDependencyInjector {
    return new AwilixTeamFounderUserDependencyInjector();
  }
}
