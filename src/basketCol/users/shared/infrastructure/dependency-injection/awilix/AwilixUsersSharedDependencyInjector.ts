import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressUsersSharedServerErrorHandler } from '../../server/express/ExpressUsersSharedServerErrorHandler';
import { IUsersSharedContainer } from '../IUsersSharedContainer';

export class AwilixUsersSharedDependencyInjector extends AwilixDependencyInjector<IUsersSharedContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      usersSharedServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressUsersSharedServerErrorHandler.create).singleton(),
    });
  }

  public static create(): AwilixUsersSharedDependencyInjector {
    return new AwilixUsersSharedDependencyInjector();
  }
}
