import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressCompetitionsSharedServerErrorHandler } from '../../server/express/ExpressCompetitionsSharedServerErrorHandler';
import { ICompetitionsSharedContainer } from '../ICompetitionsSharedContainer';

export class AwilixCompetitionsSharedDependencyInjector extends AwilixDependencyInjector<ICompetitionsSharedContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      competitionsSharedServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressCompetitionsSharedServerErrorHandler).singleton(),
    });
  }
}
