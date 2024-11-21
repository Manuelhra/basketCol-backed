import {
  BusinessDateDomainService,
  EmailUniquenessValidatorDomainService,
  IdUniquenessValidatorDomainService,
  IEmailUniquenessValidatorDomainServiceRepository,
  IIdUniquenessValidatorDomainServiceRepository,
  ILeagueFounderUserRepository,
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
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.leagueFounderUserRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        emailUniquenessValidatorDomainService: cradle.emailUniquenessValidatorDomainService,
        leagueFounderUserRepository: cradle.leagueFounderUserRepository,
      })),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      emailUniquenessValidatorDomainService: AwilixDependencyInjector.registerAsFunction<EmailUniquenessValidatorDomainService>((cradle: ILeagueFounderUserContainer) => EmailUniquenessValidatorDomainService.create({
        emailUniquenessValidatorDomainServiceRepository: cradle.leagueFounderUserRepository as IEmailUniquenessValidatorDomainServiceRepository,
      })).singleton(),
      leagueFounderUserRepository: AwilixDependencyInjector.registerAsFunction<ILeagueFounderUserRepository>(MongooseLeagueFounderUserRepository.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      profileImageUploader: AwilixDependencyInjector.registerAsFunction<IProfileImageUploader>(() => S3ProfileImageUploader.create({
        folderPath: 'league-founder',
      })).singleton(),
    });
  }

  public static create(): AwilixLeagueFounderUserDependencyInjector {
    return new AwilixLeagueFounderUserDependencyInjector();
  }
}
