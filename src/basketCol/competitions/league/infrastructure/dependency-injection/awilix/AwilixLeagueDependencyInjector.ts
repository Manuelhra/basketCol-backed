import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressLeagueServerErrorHandler } from '../../server/express/ExpressLeagueServerErrorHandler';
import { ILeagueContainer } from '../ILeagueContainer';

export class AwilixLeagueDependencyInjector extends AwilixDependencyInjector<ILeagueContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      leagueServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressLeagueServerErrorHandler).singleton(),
    });
  }
}
