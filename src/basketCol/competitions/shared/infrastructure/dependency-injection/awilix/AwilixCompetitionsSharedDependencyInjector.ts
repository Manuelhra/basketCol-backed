import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressCompetitionsSharedServerErrorHandler } from '../../server/express/ExpressCompetitionsSharedServerErrorHandler';
import { ICompetitionsSharedContainer } from '../ICompetitionsSharedContainer';

export class AwilixCompetitionsSharedDependencyInjector extends AwilixDependencyInjector<ICompetitionsSharedContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      competitionsSharedServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressCompetitionsSharedServerErrorHandler.create).singleton(),
    });
  }

  public static create(): AwilixCompetitionsSharedDependencyInjector {
    return new AwilixCompetitionsSharedDependencyInjector();
  }
}
