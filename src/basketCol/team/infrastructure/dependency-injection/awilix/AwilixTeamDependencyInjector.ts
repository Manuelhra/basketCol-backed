import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressTeamServerErrorHandler } from '../../server/express/ExpressTeamServerErrorHandler';
import { ITeamContainer } from '../ITeamContainer';

export class AwilixTeamDependencyInjector extends AwilixDependencyInjector<ITeamContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      teamServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressTeamServerErrorHandler).singleton(),
    });
  }
}
