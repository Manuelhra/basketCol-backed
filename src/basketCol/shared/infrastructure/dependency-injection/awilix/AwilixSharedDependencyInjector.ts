import { ITokenValidatorService } from '../../../../authentication/application/services/ITokenValidatorService';
import { JwtTokenValidatorService } from '../../../../authentication/infrastructure/services/jwt/JwtTokenValidatorService';
import { IHttpResponseHandler } from '../../../application/http/ports/IHttpResponseHandler';
import { HttpResponseHandler } from '../../http/HttpResponseHandler';
import { ExpressSharedServerErrorHandler } from '../../server/express/ExpressSharedServerErrorHandler';
import { IServerErrorHandler } from '../../server/IServerErrorHandler';
import { ISharedContainer } from '../ISharedContainer';
import { AwilixDependencyInjector } from './AwilixDependencyInjector';

export class AwilixSharedDependencyInjector extends AwilixDependencyInjector<ISharedContainer> {
  private constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsFunction<IHttpResponseHandler>(HttpResponseHandler.create).singleton(),
      sharedServerErrorHandler: AwilixDependencyInjector.registerAsFunction<IServerErrorHandler>(ExpressSharedServerErrorHandler.create).singleton(),
      tokenValidatorService: AwilixDependencyInjector.registerAsFunction<ITokenValidatorService>(JwtTokenValidatorService.create).singleton(),
    });
  }

  public static create(): AwilixSharedDependencyInjector {
    return new AwilixSharedDependencyInjector();
  }
}
