import { IHttpResponseHandler } from '../../../../../../shared/application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../shared/infrastructure/server/IServerErrorHandler';

export interface ILeagueSeasonFixtureContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueSeasonFixtureServerErrorHandler: IServerErrorHandler;
}
