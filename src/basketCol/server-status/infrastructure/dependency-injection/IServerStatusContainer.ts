import { IHttpResponseHandler } from '../../../shared/application/http/IHttpResponseHandler';
import { IFileSystem } from '../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../shared/infrastructure/server/routes/IRouteManager';

export interface IServerStatusContainer {
  basePath: string;
  serverStatusGETController: IController;
  fileSystem: IFileSystem;
  serverStatusRouteManager: IRouteManager;
  httpResponseHandler: IHttpResponseHandler;
}
