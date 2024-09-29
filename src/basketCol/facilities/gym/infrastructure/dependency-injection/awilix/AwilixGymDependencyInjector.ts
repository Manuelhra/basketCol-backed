import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressGymServerErrorHandler } from '../../server/express/ExpressGymServerErrorHandler';
import { IGymContainer } from '../IGymContainer';

export class AwilixGymDependencyInjector extends AwilixDependencyInjector<IGymContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      gymServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressGymServerErrorHandler.create).singleton(),
    });
  }

  public static create(): AwilixGymDependencyInjector {
    return new AwilixGymDependencyInjector();
  }
}
