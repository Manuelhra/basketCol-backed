import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressTeamFounderUserServerErrorHandler } from '../../server/express/ExpressTeamFounderUserServerErrorHandler';
import { ITeamFounderUserContainer } from '../ITeamFounderUserContainer';

export class AwilixTeamFounderUserDependencyInjector extends AwilixDependencyInjector<ITeamFounderUserContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      teamFounderUserServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressTeamFounderUserServerErrorHandler).singleton(),
    });
  }
}
