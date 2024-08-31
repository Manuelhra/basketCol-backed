import { HttpStatus } from '@basketcol/domain';
import { urlencoded, json } from 'body-parser';
import compression from 'compression';
import express, { Application, Response } from 'express';
import errorHandler from 'errorhandler';
import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';

import { IServer } from '../..';
import { IRouteManager } from '../../routes/IRouteManager';
import { IServerErrorHandle } from '../../IServerErrorHandler';

export class ExpressServer implements IServer<express.Router, Response> {
  readonly #app: Application;

  readonly #router: express.Router;

  private httpServer: http.Server | undefined;

  constructor() {
    this.#app = express();
    this.#router = Router();

    this.setUpMiddlewares();
    this.#router.use(errorHandler());
    this.#app.use(this.#router);
  }

  public async listen(port: string): Promise<void> {
    return new Promise((resolve) => {
      const env = this.#app.get('env') as string;
      this.httpServer = this.#app.listen(port, () => {
        console.log(`Basketcol Backend App is running at http://localhost:${port} in ${env} mode`);
        console.log('Press CTRL-C to stop');
        resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer !== undefined) {
        this.httpServer.close((error) => {
          if (error === undefined) resolve();
          else reject(error);
        });
      }

      resolve();
    });
  }

  public getHTTPServer(): ExpressServer['httpServer'] {
    return this.httpServer;
  }

  public registerRoutes(routeManager: IRouteManager<express.Router>[]): void {
    routeManager.forEach((manager) => manager.registerRoutes(this.#router));
  }

  public handleErrors(expressServerErrorHandlerList: IServerErrorHandle<Response>[]): void {
    this.#router.use((error: Error, _req: express.Request, res: express.Response, next: express.NextFunction): void => {
      if (error !== undefined && error !== null) {
        console.log(error);

        expressServerErrorHandlerList.forEach((expressServerErrorHandler) => {
          expressServerErrorHandler.run(res, error);
        });

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();

        return;
      }

      next();
    });
  }

  private setUpMiddlewares(): void {
    this.#app.use(json());
    this.#app.use(urlencoded({ extended: true }));
    this.#app.use(helmet.xssFilter());
    this.#app.use(helmet.noSniff());
    this.#app.use(helmet.hidePoweredBy());
    this.#app.use(helmet.frameguard({ action: 'deny' }));
    this.#app.use(compression());
  }
}
