import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressLeagueSeasonFixtureGameServerErrorHandler } from '../../server/express/ExpressLeagueSeasonFixtureGame';
import { ILeagueSeasonFixtureGameContainer } from '../ILeagueSeasonFixtureGameContainer';

export class AwilixLeagueSeasonFixtureGameDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonFixtureGameContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      leagueSeasonFixtureGameServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressLeagueSeasonFixtureGameServerErrorHandler).singleton(),
    });
  }
}
