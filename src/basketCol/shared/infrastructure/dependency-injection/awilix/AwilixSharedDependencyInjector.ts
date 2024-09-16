import { IHttpResponseHandler } from '../../../application/http/IHttpResponseHandler';
import { HttpResponseHandler } from '../../http/HttpResponseHandler';
import { ExpressSharedServerErrorHandler } from '../../server/express/server/ExpressSharedServerErrorHandler';
import { IServerErrorHandler } from '../../server/IServerErrorHandler';
import { ISharedContainer } from '../ISharedContainer';
import { AwilixDependencyInjector } from './AwilixDependencyInjector';

export class AwilixSharedDependencyInjector extends AwilixDependencyInjector<ISharedContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      sharedServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressSharedServerErrorHandler).singleton(),
    });
  }
}
