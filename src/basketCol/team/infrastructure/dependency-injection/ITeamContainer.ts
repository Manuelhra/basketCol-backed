import { IHttpResponseHandler } from '../../../shared/application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../shared/infrastructure/server/IServerErrorHandler';

export interface ITeamContainer {
  httpResponseHandler: IHttpResponseHandler;
  teamServerErrorHandler: IServerErrorHandler;
}
