import { ITokenValidatorService } from '../../../../authentication/application/services/ITokenValidatorService';
import { JwtTokenValidatorService } from '../../../../authentication/infrastructure/services/jwt/JwtTokenValidatorService';
import { IHttpResponseHandler } from '../../../application/http/ports/IHttpResponseHandler';
import { HttpResponseHandler } from '../../http/HttpResponseHandler';
import { ExpressSharedServerErrorHandler } from '../../server/express/ExpressSharedServerErrorHandler';
import { IServerErrorHandler } from '../../server/IServerErrorHandler';
import { ISharedContainer } from '../ISharedContainer';
import { AwilixDependencyInjector } from './AwilixDependencyInjector';

export class AwilixSharedDependencyInjector extends AwilixDependencyInjector<ISharedContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
      sharedServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandler>(ExpressSharedServerErrorHandler).singleton(),
      tokenValidatorService: AwilixDependencyInjector.registerAsClass<ITokenValidatorService>(JwtTokenValidatorService).singleton(),
    });
  }
}
