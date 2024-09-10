import {
  BusinessDateService,
  ICreatePasswordValueObjectService,
  IHostUserRepository,
  IPasswordEncrypterService,
  SecurePasswordCreationService,
} from '@basketcol/domain';
import { Request, Response, Router } from 'express';
import { Mongoose, Schema } from 'mongoose';

import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';
import { IMongooseHostUserDocument } from '../persistence/mongoose/IMongooseHostUserDocument';
import { IMongooseConfig } from '../../../../shared/infrastructure/persistence/mongoose/IMongooseConfig';
import { ICreateHostUserUseCase } from '../../application/use-cases/ports/ICreateHostUserUseCase';

export interface IHostUserContainer {
  basePath: string;
  businessDateService: BusinessDateService;
  createHostUserUseCase: ICreateHostUserUseCase;
  createPasswordValueObjectService: ICreatePasswordValueObjectService;
  expressHostUserPostController: IController<Request, Response>;
  expressHostUserRouteManager: IRouteManager<Router>;
  fileSystem: IFileSystem;
  hostUserRepository: IHostUserRepository;
  mongooseClient: Promise<Mongoose>;
  mongooseConfig: IMongooseConfig;
  mongooseSchema: Schema<IMongooseHostUserDocument>;
  passwordEncrypterService: IPasswordEncrypterService;
  securePasswordCreationService: SecurePasswordCreationService;
}
