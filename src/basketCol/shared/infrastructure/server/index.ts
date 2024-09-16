import { IServerErrorHandler } from './IServerErrorHandler';
import { IRouteManager } from './routes/IRouteManager';

export interface IServer {
  listen(port: string): Promise<void>;
  stop(): Promise<void>;
  registerRoutes(routerManager: IRouteManager[]) : void;
  handleErrors(serverErrorHandlerList: IServerErrorHandler[]): void;
}
