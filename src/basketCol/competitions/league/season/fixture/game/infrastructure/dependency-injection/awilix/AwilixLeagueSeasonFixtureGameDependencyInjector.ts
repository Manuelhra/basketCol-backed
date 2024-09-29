import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressLeagueSeasonFixtureGameServerErrorHandler } from '../../server/express/ExpressLeagueSeasonFixtureGame';
import { ILeagueSeasonFixtureGameContainer } from '../ILeagueSeasonFixtureGameContainer';

export class AwilixLeagueSeasonFixtureGameDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonFixtureGameContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueSeasonFixtureGameServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueSeasonFixtureGameServerErrorHandler.create).singleton(),
    });
  }

  public static create(): AwilixLeagueSeasonFixtureGameDependencyInjector {
    return new AwilixLeagueSeasonFixtureGameDependencyInjector();
  }
}
