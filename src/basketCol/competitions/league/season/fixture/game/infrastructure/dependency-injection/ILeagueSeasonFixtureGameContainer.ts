import { IHttpResponseHandler } from '../../../../../../../shared/application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../../shared/infrastructure/server/IServerErrorHandler';

export interface ILeagueSeasonFixtureGameContainer {
  httpResponseHandler: IHttpResponseHandler;
  leagueSeasonFixtureGameServerErrorHandler: IServerErrorHandler;
}
