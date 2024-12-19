import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  IIdUniquenessValidatorDomainServiceRepository,
  ILeagueSeasonAwardsRepository,
  ILeagueSeasonRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  IPlayerUserRepository,
  ITeamRepository,
  LeagueSeasonValidationDomainService,
  PasswordValueObjectCreationDomainService,
  PlayerUserValidationDomainService,
  SecurePasswordCreationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { CreateLeagueSeasonAwardsUseCase } from '../../../application/use-cases/CreateLeagueSeasonAwardsUseCase';
import { ICreateLeagueSeasonAwardsUseCase } from '../../../application/use-cases/ports/ICreateLeagueSeasonAwardsUseCase';
import { ExpressCreateLeagueSeasonAwardsPOSTController } from '../../server/express/controllers/ExpressCreateLeagueSeasonAwardsPOSTController';
import { ExpressLeagueSeasonAwardsRouteManager } from '../../server/express/routes/ExpressLeagueSeasonAwardsRouteManager';
import { ILeagueSeasonAwardsContainer } from '../ILeagueSeasonAwardsContainer';
import { ExpressFindLeagueSeasonAwardsByLeagueSeasonIdGETController } from '../../server/express/controllers/ExpressFindLeagueSeasonAwardsByLeagueSeasonIdGETController';
import { IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase } from '../../../application/use-cases/ports/IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase';
import { FindLeagueSeasonAwardsByLeagueSeasonIdUseCase } from '../../../application/use-cases/FindLeagueSeasonAwardsByLeagueSeasonIdUseCase';
import { MongooseLeagueSeasonAwardsRepository } from '../../persistence/mongoose/MongooseLeagueSeasonAwardsRepository';
import { MongooseLeagueSeasonRepository } from '../../../../infrastructure/persistence/mongoose/MongooseLeagueSeasonRepository';
import { MongoosePlayerUserRepository } from '../../../../../../../users/player/infrastructure/persistence/mongoose/MongoosePlayerUserRepository';
import { BcryptPasswordHashingService } from '../../../../../../../shared/infrastructure/services/BcryptPasswordHashingService';
import { MongooseTeamRepository } from '../../../../../../../team/infrastructure/persistence/mongoose/MongooseTeamRepository';

export class AwilixLeagueSeasonAwardsDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonAwardsContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      leagueSeasonAwardsRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressLeagueSeasonAwardsRouteManager.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(() => GlobFileSystem.create({
        basePath: __dirname,
      })).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      createLeagueSeasonAwardsPOSTController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressCreateLeagueSeasonAwardsPOSTController.create).singleton(),
      createLeagueSeasonAwardsUseCase: AwilixDependencyInjector.registerAsFunction<ICreateLeagueSeasonAwardsUseCase>((cradle: ILeagueSeasonAwardsContainer) => CreateLeagueSeasonAwardsUseCase.create({
        idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService.create({
          idUniquenessValidatorDomainServiceRepository: cradle.leagueSeasonAwardsRepository as IIdUniquenessValidatorDomainServiceRepository,
        }),
        businessDateDomainService: cradle.businessDateDomainService,
        leagueSeasonAwardsRepository: cradle.leagueSeasonAwardsRepository,
        leagueSeasonValidationDomainService: cradle.leagueSeasonValidationDomainService,
        playerUserValidationDomainService: cradle.playerUserValidationDomainService,
        teamValidationDomainService: cradle.teamValidationDomainService,
      })).singleton(),
      businessDateDomainService: AwilixDependencyInjector.registerAsFunction<BusinessDateDomainService>(BusinessDateDomainService.create).singleton(),
      findLeagueSeasonAwardsByLeagueSeasonIdGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressFindLeagueSeasonAwardsByLeagueSeasonIdGETController.create).singleton(),
      findLeagueSeasonAwardsByLeagueSeasonIdUseCase: AwilixDependencyInjector.registerAsFunction<IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase>(FindLeagueSeasonAwardsByLeagueSeasonIdUseCase.create).singleton(),
      leagueSeasonAwardsRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonAwardsRepository>(MongooseLeagueSeasonAwardsRepository.create).singleton(),
      leagueSeasonValidationDomainService: AwilixDependencyInjector.registerAsFunction<LeagueSeasonValidationDomainService>(LeagueSeasonValidationDomainService.create).singleton(),
      playerUserValidationDomainService: AwilixDependencyInjector.registerAsFunction<PlayerUserValidationDomainService>(PlayerUserValidationDomainService.create).singleton(),
      teamValidationDomainService: AwilixDependencyInjector.registerAsFunction<TeamValidationDomainService>(TeamValidationDomainService.create).singleton(),
      leagueSeasonRepository: AwilixDependencyInjector.registerAsFunction<ILeagueSeasonRepository>(MongooseLeagueSeasonRepository.create).singleton(),
      playerUserRepository: AwilixDependencyInjector.registerAsFunction<IPlayerUserRepository>(MongoosePlayerUserRepository.create).singleton(),
      passwordHashingDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordHashingDomainService>(BcryptPasswordHashingService.create).singleton(),
      passwordValueObjectCreationDomainService: AwilixDependencyInjector.registerAsFunction<IPasswordValueObjectCreationDomainService>(PasswordValueObjectCreationDomainService.create).singleton(),
      securePasswordCreationDomainService: AwilixDependencyInjector.registerAsFunction<SecurePasswordCreationDomainService>(SecurePasswordCreationDomainService.create).singleton(),
      teamRepository: AwilixDependencyInjector.registerAsFunction<ITeamRepository>(MongooseTeamRepository.create).singleton(),
    });
  }

  public static create(): AwilixLeagueSeasonAwardsDependencyInjector {
    return new AwilixLeagueSeasonAwardsDependencyInjector();
  }
}
