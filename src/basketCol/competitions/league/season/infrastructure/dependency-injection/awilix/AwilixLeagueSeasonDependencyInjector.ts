import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressLeagueSeasonServerErrorHandler } from '../../server/express/ExpressLeagueSeasonServerErrorHandler';
import { ILeagueSeasonContainer } from '../ILeagueSeasonContainer';

export class AwilixLeagueSeasonDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      leagueSeasonServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressLeagueSeasonServerErrorHandler).singleton(),
    });
  }
}
