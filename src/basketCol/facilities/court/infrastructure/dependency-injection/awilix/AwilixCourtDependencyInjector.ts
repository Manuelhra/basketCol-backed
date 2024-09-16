import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressCourtServerErrorHandler } from '../../server/express/ExpressCourtServerErrorHandler';
import { ICourtContainer } from '../ICourtContainer';

export class AwilixCourtDependencyInjector extends AwilixDependencyInjector<ICourtContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      courtServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressCourtServerErrorHandler).singleton(),
    });
  }
}
