import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressPlayerUserServerErrorHandler } from '../../server/express/ExpressPlayerUserServerErrorHandler';
import { IPlayerUserContainer } from '../IPlayerUserContainer';

export class AwilixPlayerUserDependencyInjector extends AwilixDependencyInjector<IPlayerUserContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      playerUserServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressPlayerUserServerErrorHandler).singleton(),
    });
  }
}
