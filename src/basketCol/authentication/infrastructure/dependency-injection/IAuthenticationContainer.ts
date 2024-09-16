import {
  ICreatePasswordValueObjectService,
  IHostUserRepository,
  ILeagueFounderUserRepository,
  IPasswordEncrypterService,
  IPlayerUserRepository,
  IRefereeUserRepository,
  ITFURepository as ITeamFounderUserRepository,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Mongoose, Schema } from 'mongoose';

import { IAuthenticateUserUseCase } from '../../application/use-cases/ports/IAuthenticateUserUseCase';
import { PasswordValidationService } from '../../application/services/PasswordValidationService';
import { ITokenGeneratorService } from '../../application/services/ITokenGeneratorService';
import { IMongoosePlayerUserDocument } from '../../../users/player/infrastructure/persistence/mongoose/IMongoosePlayerUserDocument';
import { IMongooseHostUserDocument } from '../../../users/host/infrastructure/persistence/mongoose/IMongooseHostUserDocument';
import { IMongooseRefereeUserDocument } from '../../../users/referee/infrastructure/persistence/mongoose/IMongooseRefereeUserDocument';
import { IMongooseLeagueFounderUserDocument } from '../../../users/league-founder/infrastructure/persistence/mongoose/IMongooseLeagueFounderUserDocument';
import { IMongooseTeamFounderUserDocument } from '../../../users/team-founder/infrastructure/persistence/mongoose/IMongooseTeamFounderUserDocument';
import { IController } from '../../../shared/infrastructure/server/controllers/IController';
import { IHttpResponseHandler } from '../../../shared/application/http/IHttpResponseHandler';
import { IRouteManager } from '../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../shared/infrastructure/file-system/IFileSystem';
import { IServerErrorHandler } from '../../../shared/infrastructure/server/IServerErrorHandler';

export interface IAuthenticationContainer {
  authenticationServerErrorHandler: IServerErrorHandler;
  authenticateUserPOSTController: IController;
  authenticateUserUseCase: IAuthenticateUserUseCase;
  authenticationRouteManager: IRouteManager;
  basePath: string;
  createPasswordValueObjectService: ICreatePasswordValueObjectService;
  fileSystem: IFileSystem;
  hostUserMongooseSchema: Schema<IMongooseHostUserDocument>;
  hostUserRepository: IHostUserRepository;
  httpResponseHandler: IHttpResponseHandler;
  leagueFounderUserMongooseSchema: Schema<IMongooseLeagueFounderUserDocument>;
  leagueFounderUserRepository: ILeagueFounderUserRepository;
  mongooseClient: Promise<Mongoose>;
  passwordEncrypterService: IPasswordEncrypterService;
  passwordValidationService: PasswordValidationService;
  playerUserMongooseSchema: Schema<IMongoosePlayerUserDocument>;
  playerUserRepository: IPlayerUserRepository;
  refereeUserMongooseSchema: Schema<IMongooseRefereeUserDocument>;
  refereeUserRepository: IRefereeUserRepository;
  securePasswordCreationService: SecurePasswordCreationService;
  teamFounderUserMongooseSchema: Schema<IMongooseTeamFounderUserDocument>;
  teamFounderUserRepository: ITeamFounderUserRepository;
  tokenGeneratorService: ITokenGeneratorService;
}
