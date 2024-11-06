import {
  BusinessDateService,
  EmailUniquenessValidatorService,
  IdUniquenessValidatorService,
  IEmailUniquenessValidatorServiceRepository,
  IIdUniquenessValidatorServiceRepository,
  ILeagueFounderUserRepository,
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
import { CreateLeagueFounderUserUseCase } from '../../../application/use-cases/CreateLeagueFounderUserUseCase';
import { ICreateLeagueFounderUserUseCase } from '../../../application/use-cases/ports/ICreateLeagueFounderUserUseCase';
import { ExpressCreateLeagueFounderUserPOSTController } from '../../server/express/controllers/ExpressCreateLeagueFounderUserPOSTController';
import { ExpressLeagueFounderUserServerErrorHandler } from '../../server/express/ExpressLeagueFounderUserServerErrorHandler';
import { ExpressLeagueFounderUserRouteManager } from '../../server/express/routes/ExpressLeagueFounderUserRouteManager';
import { ILeagueFounderUserContainer } from '../ILeagueFounderUserContainer';
import { MongooseLeagueFounderUserRepository } from '../../persistence/mongoose/MongooseLeagueFounderUserRepository';
import { IProfileImageUploader } from '../../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { S3ProfileImageUploader } from '../../../../shared/infrastructure/file-upload/images/aws/S3ProfileImageUploader';
import { BcryptPasswordHashingService } from '../../../../../shared/infrastructure/services/BcryptPasswordHashingService';

export class AwilixLeagueFounderUserDependencyInjector extends AwilixDependencyInjector<ILeagueFounderUserContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      leagueFounderUserRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressLeagueFounderUserRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueFounderUserServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueFounderUserServerErrorHandler.create).singleton(),
      createLeagueFounderUserPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateLeagueFounderUserPOSTController.create).singleton(),
      createLeagueFounderUserUseCase: AwilixDependencyInjector.registerAsFunction<ICreateLeagueFounderUserUseCase>((cradle: ILeagueFounderUserContainer) => CreateLeagueFounderUserUseCase.create({
        idUniquenessValidatorService: IdUniquenessValidatorService.create({
          idUniquenessValidatorServiceRepository: cradle.leagueFounderUserRepository as IIdUniquenessValidatorServiceRepository,
        }),
        businessDateService: cradle.businessDateService,
        emailUniquenessValidatorService: cradle.emailUniquenessValidatorService,
        leagueFounderUserRepository: cradle.leagueFounderUserRepository,
      })),
      businessDateService: AwilixDependencyInjector.registerAsFunction<BusinessDateService>(BusinessDateService.create).singleton(),
      emailUniquenessValidatorService: AwilixDependencyInjector.registerAsFunction<EmailUniquenessValidatorService>((cradle: ILeagueFounderUserContainer) => EmailUniquenessValidatorService.create({
        emailUniquenessValidatorServiceRepository: cradle.leagueFounderUserRepository as IEmailUniquenessValidatorServiceRepository,
      })).singleton(),
      leagueFounderUserRepository: AwilixDependencyInjector.registerAsFunction<ILeagueFounderUserRepository>(MongooseLeagueFounderUserRepository.create).singleton(),
      passwordHashingService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationService>(PasswordValueObjectCreationService.create).singleton(),
      securePasswordCreationService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationService>(SecurePasswordCreationService.create).singleton(),
      profileImageUploader: AwilixDependencyInjector.registerAsFunction<IProfileImageUploader>(() => S3ProfileImageUploader.create({
        folderPath: 'league-founder',
      })).singleton(),
    });
  }

  public static create(): AwilixLeagueFounderUserDependencyInjector {
    return new AwilixLeagueFounderUserDependencyInjector();
  }
}
