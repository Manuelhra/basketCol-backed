import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressLeagueServerErrorHandler } from '../../server/express/ExpressLeagueServerErrorHandler';
import { ILeagueContainer } from '../ILeagueContainer';

export class AwilixLeagueDependencyInjector extends AwilixDependencyInjector<ILeagueContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueServerErrorHandler.create).singleton(),
    });
  }

  public static create(): AwilixLeagueDependencyInjector {
    return new AwilixLeagueDependencyInjector();
  }
}
