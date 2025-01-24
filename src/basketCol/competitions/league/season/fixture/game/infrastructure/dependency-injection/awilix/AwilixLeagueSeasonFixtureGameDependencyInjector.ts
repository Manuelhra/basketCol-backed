import {
  BusinessDateDomainService,
  CourtValidationDomainService,
  ICourtRepository,
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  ILeagueSeasonFixtureGameRepository,
  ILeagueSeasonFixtureRepository,
  ILeagueSeasonRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IRefereeUserRepository,
  ITeamRepository,
  LeagueSeasonFixtureValidationDomainService,
  LeagueSeasonValidationDomainService,
  PasswordValueObjectCreationDomainService,
  RefereeUserValidationDomainService,
  SecurePasswordCreationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { CreateLeagueSeasonFixtureGameUseCase } from '../../../application/use-cases/CreateLeagueSeasonFixtureGameUseCase';
import { ICreateLeagueSeasonFixtureGameUseCase } from '../../../application/use-cases/ports/ICreateLeagueSeasonFixtureGameUseCase';
import { ExpressBulkCreateLeagueSeasonFixtureGameFromExcelPOSTController } from '../../server/express/controllers/ExpressBulkCreateLeagueSeasonFixtureGameFromExcelPOSTController';
import { ExpressLeagueSeasonFixtureGameServerErrorHandler } from '../../server/express/ExpressLeagueSeasonFixtureGameServerErrorHandler';
import { ExpressLeagueSeasonFixtureGameRouteManager } from '../../server/express/routes/ExpressLeagueSeasonFixtureGameRouteManager';
import { BulkCreateLeagueSeasonFixtureGameFromExcelService } from '../../services/BulkCreateLeagueSeasonFixtureGameFromExcelService';
import { ILeagueSeasonFixtureGameContainer } from '../ILeagueSeasonFixtureGameContainer';
import { MongooseLeagueSeasonFixtureGameRepository } from '../../persistence/MongooseLeagueSeasonFixtureGameRepository';
import { MongooseLeagueSeasonRepository } from '../../../../../infrastructure/persistence/mongoose/MongooseLeagueSeasonRepository';
import { MongooseRefereeUserRepository } from '../../../../../../../../users/referee/infrastructure/persistence/mongoose/MongooseRefereeUserRepository';
import { MongooseTeamRepository } from '../../../../../../../../team/infrastructure/persistence/mongoose/MongooseTeamRepository';
import { IExcelManager } from '../../../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { XLSXManager } from '../../../../../../../../shared/infrastructure/file-upload/excel/xlsx/XLSXManager';
import { ExpressFindAllLeagueSeasonFixtureGamesByFixtureIdGETController } from '../../server/express/controllers/ExpressFindAllLeagueSeasonFixtureGamesByFixtureIdGETController';
import { IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase } from '../../../application/use-cases/ports/IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase';
import { FindAllLeagueSeasonFixtureGamesByFixtureIdUseCase } from '../../../application/use-cases/FindAllLeagueSeasonFixtureGamesByFixtureIdUseCase';
import { MongooseCourtRepository } from '../../../../../../../../facilities/court/infrastructure/persistence/mongoose/MongooseCourtRepository';
import { BcryptPasswordHashingService } from '../../../../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { IUuidGenerator } from '../../../../../../../../shared/application/uuid/ports/IUuidGenerator';
import { UuidV4Generator } from '../../../../../../../../shared/infrastructure/uuid/UuidV4Generator';
import { MongooseLeagueSeasonFixtureRepository } from '../../../../infrastructure/persistence/mongoose/MongooseLeagueSeasonFixtureRepository';

export class AwilixLeagueSeasonFixtureGameDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonFixtureGameContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      leagueSeasonFixtureGameRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressLeagueSeasonFixtureGameRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueSeasonFixtureGameServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueSeasonFixtureGameServerErrorHandler.create).singleton(),
      bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressBulkCreateLeagueSeasonFixtureGameFromExcelPOSTController.create).singleton(),
      bulkCreateLeagueSeasonFixtureGameFromExcelService: AwilixDependencyInjector.registerAsFunction<BulkCreateLeagueSeasonFixtureGameFromExcelService>(BulkCreateLeagueSeasonFixtureGameFromExcelService.create).singleton(),
      excelManager: AwilixDependencyInjector.registerAsFunction<IExcelManager>(XLSXManager.create).singleton(),
      createLeagueSeasonFixtureGameUseCase: AwilixDependencyInjector.registerAsFunction<ICreateLeagueSeasonFixtureGameUseCase>((cradle: ILeagueSeasonFixtureGameContainer) => CreateLeagueSeasonFixtureGameUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.leagueSeasonFixtureGameRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        courtValidationDomainService: cradle.courtValidationDomainService,
        leagueSeasonFixtureGameRepository: cradle.leagueSeasonFixtureGameRepository,
        leagueSeasonFixtureValidationDomainService: cradle.leagueSeasonFixtureValidationDomainService,
        refereeUserValidationDomainService: cradle.refereeUserValidationDomainService,
        teamValidationDomainService: cradle.teamValidationDomainService,
      })),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      courtValidationDomainService: AwilixDependencyInjector.registerAsFunction<CourtValidationDomainService>(CourtValidationDomainService.create).singleton(),
      leagueSeasonFixtureGameRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonFixtureGameRepository>(MongooseLeagueSeasonFixtureGameRepository.create).singleton(),
      leagueSeasonFixtureValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonFixtureValidationDomainService>(LeagueSeasonFixtureValidationDomainService.create).singleton(),
      leagueSeasonValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonValidationDomainService>(LeagueSeasonValidationDomainService.create).singleton(),
      leagueSeasonRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonRepository>(MongooseLeagueSeasonRepository.create).singleton(),
      refereeUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<RefereeUserValidationDomainService>(RefereeUserValidationDomainService.create).singleton(),
      teamValidationDomainService: AwilixDependencyInjector.registerAsFunction<TeamValidationDomainService>(TeamValidationDomainService.create).singleton(),
      teamRepository: AwilixDependencyInjector.registerAsFunction<ITeamRepository>(MongooseTeamRepository.create).singleton(),
      refereeUserRepository: AwilixDependencyInjector.registerAsFunction<IRefereeUserRepository>(MongooseRefereeUserRepository.create).singleton(),
      findAllLeagueSeasonFixtureGamesByFixtureIdGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressFindAllLeagueSeasonFixtureGamesByFixtureIdGETController.create).singleton(),
      findAllLeagueSeasonFixtureGamesByFixtureIdUseCase: AwilixDependencyInjector.registerAsFunction<IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase>(FindAllLeagueSeasonFixtureGamesByFixtureIdUseCase.create).singleton(),
      courtRepository: AwilixDependencyInjector.registerAsFunction<ICourtRepository>(MongooseCourtRepository.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      uuidGenerator: AwilixDependencyInjector.registerAsFunction<IUuidGenerator>(UuidV4Generator.create).singleton(),
      leagueSeasonFixtureRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonFixtureRepository>(MongooseLeagueSeasonFixtureRepository.create).singleton(),
    });
  }

  public static create(): AwilixLeagueSeasonFixtureGameDependencyInjector {
    return new AwilixLeagueSeasonFixtureGameDependencyInjector();
  }
}
