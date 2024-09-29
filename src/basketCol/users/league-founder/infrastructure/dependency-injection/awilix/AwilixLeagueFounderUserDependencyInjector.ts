import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressLeagueFounderUserServerErrorHandler } from '../../server/express/ExpressLeagueFounderUserServerErrorHandler';
import { ILeagueFounderUserContainer } from '../ILeagueFounderUserContainer';

export class AwilixLeagueFounderUserDependencyInjector extends AwilixDependencyInjector<ILeagueFounderUserContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      leagueFounderUserServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressLeagueFounderUserServerErrorHandler).singleton(),
    });
  }
}
