import { IHttpResponseHandler } from '../../application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../server/IServerErrorHandler';

export interface ISharedContainer {
  httpResponseHandler: IHttpResponseHandler;
  sharedServerErrorHandler: IServerErrorHandler;
}
