import { IServerErrorHandle } from './IServerErrorHandler';
import { IRouteManager } from './routes/IRouteManager';

export interface IServer<Router, Response> {
  listen(port: string): Promise<void>;
  stop(): Promise<void>;
  registerRoutes(routerManager: IRouteManager<Router>[]) : void;
  handleErrors(serverErrorHandlerList: IServerErrorHandle<Response>[]): void;
}
