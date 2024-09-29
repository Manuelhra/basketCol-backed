import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { AwilixDependencyInjector } from '../../../../../shared/infrastructure/dependency-injection/awilix/AwilixDependencyInjector';
import { HttpResponseHandler } from '../../../../../shared/infrastructure/http/HttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { ExpressRefereeUserServerErrorHandler } from '../../server/express/ExpressRefereeUserServerErrorHandler';
import { IRefereeUserContainer } from '../IRefereeUserContainer';

export class AwilixRefereeUserDependencyInjector extends AwilixDependencyInjector<IRefereeUserContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      refereeUserServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressRefereeUserServerErrorHandler.create).singleton(),
    });
  }

  public static create(): AwilixRefereeUserDependencyInjector {
    return new AwilixRefereeUserDependencyInjector();
  }
}
