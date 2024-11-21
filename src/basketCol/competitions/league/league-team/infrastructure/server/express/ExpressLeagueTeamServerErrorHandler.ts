import { Response } from 'express';
import {
  HttpStatus,
  InvalidLeagueTeamStatusError,
  LeagueTeamAlreadyRegisteredError,
} from '@basketcol/domain';

import { IErrorApiResponse } from '../../../../../../shared/application/http/ports/IErrorApiResponse';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../shared/infrastructure/server/IServerErrorHandler';

type Dependencies = {
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressLeagueTeamServerErrorHandler implements IServerErrorHandler {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressLeagueTeamServerErrorHandler {
    return new ExpressLeagueTeamServerErrorHandler(dependencies);
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof LeagueTeamAlreadyRegisteredError:
      case error instanceof InvalidLeagueTeamStatusError:
        errorResponse = this.dependencies.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.BAD_REQUEST,
          message: HttpStatus.getMessage(HttpStatus.BAD_REQUEST),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.BAD_REQUEST;
        isInstanceof = true;
    }

    if (isInstanceof && status !== null && errorResponse !== null) {
      response.status(status).json(errorResponse);
    }
  }
}
