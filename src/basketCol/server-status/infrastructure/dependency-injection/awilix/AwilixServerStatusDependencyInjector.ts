import { Request, Response, Router } from 'express';

import { IHttpResponseHandler } from '../../../../shared/application/http/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { ExpressServerStatusGetController } from '../../server/express/controllers/ExpressServerStatusGetController';
import { ExpressServerStatusRouteManager } from '../../server/express/routes/ExpressServerStatusRouteManager';
import { IServerStatusContainer } from '../IServerStatusContainer';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';

export class AwilixServerStatusDependencyInjector extends AwilixDependencyInjector<IServerStatusContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      basePath: AwilixDependencyInjector.registerAsValue<string>(__dirname),
      expressServerStatusGetController: AwilixDependencyInjector.registerAsClass<IController<Request, Response>>(ExpressServerStatusGetController).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsClass<IFileSystem>(GlobFileSystem).singleton(),
      expressServerStatusRouteManager: AwilixDependencyInjector.registerAsClass<IRouteManager<Router>>(ExpressServerStatusRouteManager).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
    });
  }
}
