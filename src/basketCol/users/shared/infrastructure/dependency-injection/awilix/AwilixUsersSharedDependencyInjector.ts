import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressUsersSharedServerErrorHandler } from '../../server/express/ExpressUsersSharedServerErrorHandler';
import { IUsersSharedContainer } from '../IUsersSharedContainer';

export class AwilixUsersSharedDependencyInjector extends AwilixDependencyInjector<IUsersSharedContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      usersSharedServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressUsersSharedServerErrorHandler).singleton(),
    });
  }
}
