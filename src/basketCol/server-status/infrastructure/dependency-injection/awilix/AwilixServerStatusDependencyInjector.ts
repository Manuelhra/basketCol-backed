import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
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
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      basePath: AwilixDependencyInjector.registerAsValue<string>(__dirname),
      serverStatusGETController: AwilixDependencyInjector.registerAsFunction<IController>(ExpressServerStatusGETController.create).singleton(),
      fileSystem: AwilixDependencyInjector.registerAsFunction<IFileSystem>(GlobFileSystem.create).singleton(),
      serverStatusRouteManager: AwilixDependencyInjector.registerAsFunction<IRouteManager>(ExpressServerStatusRouteManager.create).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
    });
  }

  public static create(): AwilixServerStatusDependencyInjector {
    return new AwilixServerStatusDependencyInjector();
  }
}
