import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressGymServerErrorHandler } from '../../server/express/ExpressGymServerErrorHandler';
import { IGymContainer } from '../IGymContainer';

export class AwilixGymDependencyInjector extends AwilixDependencyInjector<IGymContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      gymServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressGymServerErrorHandler).singleton(),
    });
  }
}
