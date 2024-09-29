import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressCourtServerErrorHandler } from '../../server/express/ExpressCourtServerErrorHandler';
import { ICourtContainer } from '../ICourtContainer';

export class AwilixCourtDependencyInjector extends AwilixDependencyInjector<ICourtContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      courtServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressCourtServerErrorHandler.create).singleton(),
    });
  }

  public static create(): AwilixCourtDependencyInjector {
    return new AwilixCourtDependencyInjector();
  }
}
