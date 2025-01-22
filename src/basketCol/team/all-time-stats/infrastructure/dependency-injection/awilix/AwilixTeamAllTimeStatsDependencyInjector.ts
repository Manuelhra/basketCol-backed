import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressTeamAllTimeStatsServerErrorHandler } from '../../server/express/ExpressTeamAllTimeStatsServerErrorHandler';
import { ITeamAllTimeStatsContainer } from '../ITeamAllTimeStatsContainer';

export class AwilixTeamAllTimeStatsDependencyInjector extends AwilixDependencyInjector<ITeamAllTimeStatsContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      teamAllTimeStatsServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressTeamAllTimeStatsServerErrorHandler.create).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
    });
  }

  public static create(): AwilixTeamAllTimeStatsDependencyInjector {
    return new AwilixTeamAllTimeStatsDependencyInjector();
  }
}
