import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  ITeamAllTimeStatsRepository,
  ITeamFounderUserRepository,
  ITeamRepository,
  PasswordValueObjectCreationDomainService,
  SecurePasswordCreationDomainService,
  TeamFounderUserValidationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { ICreateTeamUseCase } from '../../../application/use-cases/ports/ICreateTeamUseCase';
import { ExpressCreateTeamPOSTController } from '../../server/express/controllers/ExpressCreateTeamPOSTController';
import { ExpressTeamServerErrorHandler } from '../../server/express/ExpressTeamServerErrorHandler';
import { ExpressTeamRouteManager } from '../../server/express/routes/ExpressTeamRouteManager';
import { ITeamContainer } from '../ITeamContainer';
import { CreateTeamUseCase } from '../../../application/use-cases/CreateTeamUseCase';
import { ICreateTeamAllTimeStatsUseCase } from '../../../all-time-stats/application/use-cases/ports/ICreateTeamAllTimeStatsUseCase';
import { CreateTeamAllTimeStatsUseCase } from '../../../all-time-stats/application/use-cases/CreateTeamAllTimeStatsUseCase';
import { IBatchGalleryImagesUploader } from '../../../../shared/application/file-upload/images/ports/IBatchGalleryImagesUploader';
import { IMainImageUploader } from '../../../../shared/application/file-upload/images/ports/IMainImageUploader';
import { S3BatchGalleryImagesUploader } from '../../../../shared/infrastructure/file-upload/aws/S3BatchGalleryImagesUploader';
import { S3MainImageUploader } from '../../../../shared/infrastructure/file-upload/aws/S3MainImageUploader';
import { MongooseTeamAllTimeStatsRepository } from '../../../all-time-stats/infrastructure/persistence/mongoose/MongooseTeamAllTimeStatsRepository';
import { MongooseTeamRepository } from '../../persistence/mongoose/MongooseTeamRepository';
import { IUuidGenerator } from '../../../../shared/application/uuid/ports/IUuidGenerator';
import { UuidV4Generator } from '../../../../shared/infrastructure/uuid/UuidV4Generator';
import { MongooseTeamFounderUserRepository } from '../../../../users/team-founder/infrastructure/persistence/mongoose/MongooseTeamFounderUserRepository';
import { BcryptPasswordHashingService } from '../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { ILogoUploader } from '../../../../shared/application/file-upload/images/ports/ILogoUploader';
import { S3LogoUploader } from '../../../../shared/infrastructure/file-upload/aws/S3LogoUploader';
import { ExpressFindTeamByIdGETController } from '../../server/express/controllers/ExpressFindTeamByIdGETController';
import { IFindTeamByIdUseCase } from '../../../application/use-cases/ports/IFindTeamByIdUseCase';
import { FindTeamByIdUseCase } from '../../../application/use-cases/FindTeamByIdUseCase';
import { ExpressSearchAllTeamsGETController } from '../../server/express/controllers/ExpressSearchAllTeamsGETController';
import { ISearchAllTeamsUseCase } from '../../../application/use-cases/ports/ISearchAllTeamsUseCase';
import { SearchAllTeamsUseCase } from '../../../application/use-cases/SearchAllTeamsUseCase';

export class AwilixTeamDependencyInjector extends AwilixDependencyInjector<ITeamContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      teamRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressTeamRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      teamServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressTeamServerErrorHandler.create).singleton(),
      createTeamPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateTeamPOSTController.create).singleton(),
      createTeamUseCase: AwilixDependencyInjector.registerAsFunction<ICreateTeamUseCase>((cradle: ITeamContainer) => CreateTeamUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.teamRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        createTeamAllTimeStatsUseCase: cradle.createTeamAllTimeStatsUseCase,
        teamFounderUserValidationDomainService: cradle.teamFounderUserValidationDomainService,
        teamRepository: cradle.teamRepository,
        uuidGenerator: cradle.uuidGenerator,
      })).singleton(),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      createTeamAllTimeStatsUseCase: AwilixDependencyInjector.registerAsFunction<ICreateTeamAllTimeStatsUseCase>((cradle: ITeamContainer) => CreateTeamAllTimeStatsUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.teamAllTimeStatsRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        teamAllTimeStatsRepository: cradle.teamAllTimeStatsRepository,
        teamValidationDomainService: cradle.teamValidationDomainService,
      })).singleton(),
      logoUploader: AwilixDependencyInjector.registerAsFunction<ILogoUploader>(() => S3LogoUploader.create({
        folderPath: 'team',
      })).singleton(),
      mainImageUploader: AwilixDependencyInjector.registerAsFunction<IMainImageUploader>(() => S3MainImageUploader.create({
        folderPath: 'team',
      })).singleton(),
      batchGalleryImagesUploader: AwilixDependencyInjector.registerAsFunction<IBatchGalleryImagesUploader>(() => S3BatchGalleryImagesUploader.create({
        folderPath: 'team',
      })).singleton(),
      teamAllTimeStatsRepository: AwilixDependencyInjector.registerAsFunction<ITeamAllTimeStatsRepository>(MongooseTeamAllTimeStatsRepository.create).singleton(),
      teamFounderUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<TeamFounderUserValidationDomainService>(TeamFounderUserValidationDomainService.create).singleton(),
      teamRepository: AwilixDependencyInjector.registerAsFunction<ITeamRepository>(MongooseTeamRepository.create).singleton(),
      teamValidationDomainService: AwilixDependencyInjector.registerAsFunction<TeamValidationDomainService>(TeamValidationDomainService.create).singleton(),
      tFURepository: AwilixDependencyInjector.registerAsFunction<ITeamFounderUserRepository>(MongooseTeamFounderUserRepository.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      uuidGenerator: AwilixDependencyInjector.registerAsFunction<IUuidGenerator>(UuidV4Generator.create).singleton(),
      findTeamByIdGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressFindTeamByIdGETController.create).singleton(),
      findTeamByIdUseCase: AwilixDependencyInjector.registerAsFunction<IFindTeamByIdUseCase>(FindTeamByIdUseCase.create).singleton(),
      searchAllTeamsGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressSearchAllTeamsGETController.create).singleton(),
      searchAllTeamsUseCase: AwilixDependencyInjector.registerAsFunction<ISearchAllTeamsUseCase>(SearchAllTeamsUseCase.create).singleton(),
    });
  }

  public static create(): AwilixTeamDependencyInjector {
    return new AwilixTeamDependencyInjector();
  }
}
