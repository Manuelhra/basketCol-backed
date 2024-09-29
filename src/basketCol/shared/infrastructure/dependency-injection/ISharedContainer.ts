import { ITokenValidatorService } from '../../../authentication/application/services/ITokenValidatorService';
import { IHttpResponseHandler } from '../../application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../server/IServerErrorHandler';

export interface ISharedContainer {
  httpResponseHandler: IHttpResponseHandler;
  sharedServerErrorHandler: IServerErrorHandler;
  tokenValidatorService: ITokenValidatorService;
}
