import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressLeagueSeasonFixtureServerErrorHandler } from '../../server/express/ExpressLeagueSeasonFixtureServerErrorHandler';
import { ILeagueSeasonFixtureContainer } from '../ILeagueSeasonFixtureContainer';

export class AwilixLeagueSeasonFixtureDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonFixtureContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      leagueSeasonFixtureServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressLeagueSeasonFixtureServerErrorHandler).singleton(),
    });
  }
}
