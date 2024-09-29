import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressLeagueSeasonFixtureServerErrorHandler } from '../../server/express/ExpressLeagueSeasonFixtureServerErrorHandler';
import { ILeagueSeasonFixtureContainer } from '../ILeagueSeasonFixtureContainer';

export class AwilixLeagueSeasonFixtureDependencyInjector extends AwilixDependencyInjector<ILeagueSeasonFixtureContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      leagueSeasonFixtureServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressLeagueSeasonFixtureServerErrorHandler.create).singleton(),
    });
  }

  public static create(): AwilixLeagueSeasonFixtureDependencyInjector {
    return new AwilixLeagueSeasonFixtureDependencyInjector();
  }
}
