import {
  LeagueSeasonValidationDomainService,
  BusinessDateDomainService,
  ILeagueSeasonFixtureGameRepository,
  ILeagueSeasonRepository,
  CourtValidationDomainService,
  RefereeUserValidationDomainService,
  TeamValidationDomainService,
  ITeamRepository,
  IRefereeUserRepository,
  ICourtRepository,
  IPasswordHashingDomainService,
  IPasswordValueObjectCreationDomainService,
  SecurePasswordCreationDomainService,
  LeagueSeasonFixtureValidationDomainService,
  ILeagueSeasonFixtureRepository,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IFileSystem } from '../../../../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../../../../shared/infrastructure/server/controllers/IController';
import { IServerErrorHandler } from '../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IRouteManager } from '../../../../../../../shared/infrastructure/server/routes/IRouteManager';
import { ICreateLeagueSeasonFixtureGameUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonFixtureGameUseCase';
import { BulkCreateLeagueSeasonFixtureGameFromExcelService } from '../services/BulkCreateLeagueSeasonFixtureGameFromExcelService';
import { IExcelManager } from '../../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase } from '../../application/use-cases/ports/IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase';
import { IUuidGenerator } from '../../../../../../../shared/application/uuid/ports/IUuidGenerator';

export interface ILeagueSeasonFixtureGameContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueSeasonFixtureGameServerErrorHandler: IServerErrorHandler;
  bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController: IController;
  bulkCreateLeagueSeasonFixtureGameFromExcelService: BulkCreateLeagueSeasonFixtureGameFromExcelService;
  excelManager: IExcelManager;
  createLeagueSeasonFixtureGameUseCase: ICreateLeagueSeasonFixtureGameUseCase;
  leagueSeasonValidationDomainService: LeagueSeasonValidationDomainService;
  leagueSeasonFixtureValidationDomainService: LeagueSeasonFixtureValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;
  leagueSeasonRepository: ILeagueSeasonRepository;
  leagueSeasonFixtureGameRouteManager: IRouteManager;
  fileSystem: IFileSystem;
  courtValidationDomainService: CourtValidationDomainService;
  teamValidationDomainService: TeamValidationDomainService;
  refereeUserValidationDomainService: RefereeUserValidationDomainService;
  teamRepository: ITeamRepository;
  refereeUserRepository: IRefereeUserRepository;
  findAllLeagueSeasonFixtureGamesByFixtureIdGETController: IController;
  findAllLeagueSeasonFixtureGamesByFixtureIdUseCase: IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase;
  courtRepository: ICourtRepository;
  securePasswordCreationDomainService: SecurePasswordCreationDomainService;
  passwordHashingDomainService: IPasswordHashingDomainService;
  passwordValueObjectCreationDomainService: IPasswordValueObjectCreationDomainService;
  uuidGenerator: IUuidGenerator;
  leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;
}
