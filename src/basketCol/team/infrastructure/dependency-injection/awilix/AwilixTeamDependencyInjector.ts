import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressTeamServerErrorHandler } from '../../server/express/ExpressTeamServerErrorHandler';
import { ITeamContainer } from '../ITeamContainer';

export class AwilixTeamDependencyInjector extends AwilixDependencyInjector<ITeamContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      teamServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressTeamServerErrorHandler.create).singleton(),
    });
  }

  public static create(): AwilixTeamDependencyInjector {
    return new AwilixTeamDependencyInjector();
  }
}
