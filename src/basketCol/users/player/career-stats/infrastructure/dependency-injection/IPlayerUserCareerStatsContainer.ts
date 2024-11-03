import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  IPlayerUserCareerStatsRepository,
  IPlayerUserRepository,
  PlayerUserValidationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';

import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';
import { ICreatePlayerUserCareerStatsUseCase } from '../../application/use-cases/ports/ICreatePlayerUserCareerStatsUseCase';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';
import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';

export interface IPlayerUserCareerStatsContainer {
  createPlayerUserCareerStatsPOSTController: IController;
  createPlayerUserCareerStatsUseCase: ICreatePlayerUserCareerStatsUseCase;
  idUniquenessValidatorService: IdUniquenessValidatorService;
  idUniquenessValidatorServiceRepository: IPlayerUserCareerStatsRepository;
  playerUserValidationService: PlayerUserValidationService;
  businessDateService: BusinessDateService;
  playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
  playerUserRepository: IPlayerUserRepository;
  securePasswordCreationService: SecurePasswordCreationService;
  passwordHashingService: IPasswordHashingService;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  playerUserCareerStatsRouteManager: IRouteManager;
  fileSystem: IFileSystem;
}
