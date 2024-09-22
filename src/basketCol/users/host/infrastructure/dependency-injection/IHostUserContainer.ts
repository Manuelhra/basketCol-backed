import {
  BusinessDateService,
  IHostUserRepository,
  IPasswordHashingService,
  IPasswordValueObjectCreationService,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Mongoose, Schema } from 'mongoose';

import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IMongooseHostUserDocument } from '../persistence/mongoose/IMongooseHostUserDocument';
import { ICreateHostUserUseCase } from '../../application/use-cases/ports/ICreateHostUserUseCase';
import { IHttpResponseHandler } from '../../../../shared/application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { IHostUserConfigFactory } from '../../application/ports/IHostUserConfigFactory';

export interface IHostUserContainer {
  basePath: string;
  businessDateService: BusinessDateService;
  createHostUserUseCase: ICreateHostUserUseCase;
  passwordValueObjectCreationService: IPasswordValueObjectCreationService;
  fileSystem: IFileSystem;
  hostUserMongooseSchema: Schema<IMongooseHostUserDocument>;
  hostUserConfigFactory: IHostUserConfigFactory;
  createHostUserPOSTController: IController;
  hostUserRepository: IHostUserRepository;
  hostUserRouteManager: IRouteManager;
  httpResponseHandler: IHttpResponseHandler;
  mongooseClient: Promise<Mongoose>;
  passwordHashingService: IPasswordHashingService;
  securePasswordCreationService: SecurePasswordCreationService;
  hostUserServerErrorHandler: IServerErrorHandler;
}
