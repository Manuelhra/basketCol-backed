import { IHttpResponseHandler } from '../../../../shared/application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';

export interface ICompetitionsSharedContainer {
  httpResponseHandler: IHttpResponseHandler;
  competitionsSharedServerErrorHandler: IServerErrorHandler;
}
