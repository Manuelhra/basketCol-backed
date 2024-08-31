import { Response } from 'express';

import { IHttpResponseHandler } from '../../application/http/IHttpResponseHandler';
import { IServerErrorHandle } from '../server/IServerErrorHandler';

export interface ISharedContainer {
  expressSharedServerErrorHandler: IServerErrorHandle<Response>;
  httpResponseHandler: IHttpResponseHandler;
}
