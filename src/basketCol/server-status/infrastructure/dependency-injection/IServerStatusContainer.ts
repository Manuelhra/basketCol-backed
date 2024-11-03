import { IHttpResponseHandler } from '../../../shared/application/http/ports/IHttpResponseHandler';
import { IFileSystem } from '../../../shared/infrastructure/file-system/IFileSystem';
import { IController } from '../../../shared/infrastructure/server/controllers/IController';
import { IRouteManager } from '../../../shared/infrastructure/server/routes/IRouteManager';

export interface IServerStatusContainer {
  serverStatusGETController: IController;
  fileSystem: IFileSystem;
  serverStatusRouteManager: IRouteManager;
  httpResponseHandler: IHttpResponseHandler;
}
