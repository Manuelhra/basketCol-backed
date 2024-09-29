import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';

export interface ICompetitionsSharedContainer {
  httpResponseHandler: IHttpResponseHandler;
  competitionsSharedServerErrorHandler: IServerErrorHandler;
}
