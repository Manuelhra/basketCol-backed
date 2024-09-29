import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';

export interface ITeamFounderUserContainer {
  httpResponseHandler: IHttpResponseHandler;
  teamFounderUserServerErrorHandler: IServerErrorHandler;
}
