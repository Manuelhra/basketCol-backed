import { IHttpResponseHandler } from '../../../../shared/application/http/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { GlobFileSystem } from '../../../../shared/infrastructure/file-system/GlobFileSystem';
import { IFileSystem } from '../../../../shared/infrastructure/file-system/IFileSystem';
import { HttpResponseHandler } from '../../../../shared/infrastructure/http/HttpResponseHandler';
import { IController } from '../../../../shared/infrastructure/server/controllers/IController';
import { ExpressServerStatusGETController } from '../../server/express/controllers/ExpressServerStatusGETController';
import { ExpressServerStatusRouteManager } from '../../server/express/routes/ExpressServerStatusRouteManager';
import { IServerStatusContainer } from '../IServerStatusContainer';
import { IRouteManager } from '../../../../shared/infrastructure/server/routes/IRouteManager';

export class AwilixServerStatusDependencyInjector extends AwilixDependencyInjector<IServerStatusContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      basePath: AwilixDependencyInjector.registerAsValue<string>(__dirname),
      serverStatusGETController: AwilixDependencyInjector.registerAsClass<IController>(ExpressServerStatusGETController).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsClass<IFileSystem>(GlobFileSystem).singleton(),
      serverStatusRouteManager: AwilixDependencyInjector.registerAsClass<IRouteManager>(ExpressServerStatusRouteManager).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
    });
  }
}
