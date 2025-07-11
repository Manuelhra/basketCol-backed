import { HttpStatus } from '@basketcol/domain';
import { Response } from 'express';

import { IHttpResponseHandler } from '../../../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IErrorApiResponse } from '../../../../../../../../../../shared/application/http/ports/IErrorApiResponse';
import { NoActiveTeamPlayerFoundError } from '../../../application/exceptions/NoActiveTeamPlayerFoundError';
import { PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError } from '../../../application/exceptions/PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError';

type Dependencies = {
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressPlayerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler
implements IServerErrorHandler {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressPlayerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler {
    return new ExpressPlayerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler(dependencies);
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError:
        errorResponse = this.dependencies.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.CONFLICT,
          message: HttpStatus.getMessage(HttpStatus.CONFLICT),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.CONFLICT;
        isInstanceof = true;
        break;
      case error instanceof NoActiveTeamPlayerFoundError:
        errorResponse = this.dependencies.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.BAD_REQUEST,
          message: HttpStatus.getMessage(HttpStatus.BAD_REQUEST),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.BAD_REQUEST;
        isInstanceof = true;
        break;
    }

    if (isInstanceof && status !== null && errorResponse !== null) {
      response.status(status).json(errorResponse);
    }
  }
}
