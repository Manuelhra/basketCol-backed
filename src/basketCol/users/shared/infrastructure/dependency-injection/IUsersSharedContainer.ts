import { IHttpResponseHandler } from '../../../../shared/application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';

export interface IUsersSharedContainer {
  httpResponseHandler: IHttpResponseHandler;
  usersSharedServerErrorHandler: IServerErrorHandler;
}
