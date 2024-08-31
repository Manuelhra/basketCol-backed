import { Request, Response, Router } from 'express';

import { IHttpResponseHandler } from '../../../shared/application/http/IHttpResponseHandler';
import { IFileSystem } from '../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../shared/infrastructure/server/routes/IRouteManager';

export interface IServerStatusContainer {
  basePath: string;
  expressServerStatusGetController: IController<Request, Response>;
  fileSystem: IFileSystem;
  expressServerStatusRouteManager: IRouteManager<Router>;
  httpResponseHandler: IHttpResponseHandler;
}
