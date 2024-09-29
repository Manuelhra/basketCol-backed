import {
  HttpStatus,
  InvalidLeagueSeasonStatusError,
  LeagueSeasonEndDateBeforeStartDateError,
  LeagueSeasonEndDateInPastError,
  LeagueSeasonInsufficientDurationError,
  LeagueSeasonInsufficientPreparationTimeError,
  LeagueSeasonNotFoundError,
  LeagueSeasonStartDateInPastError,
} from '@basketcol/domain';
import { Response } from 'express';

import { IErrorApiResponse } from '../../../../../../shared/application/http/ports/IErrorApiResponse';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../shared/infrastructure/server/IServerErrorHandler';

type Dependencies = {
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressLeagueSeasonServerErrorHandler implements IServerErrorHandler {
  protected readonly httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    this.httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressLeagueSeasonServerErrorHandler {
    return new ExpressLeagueSeasonServerErrorHandler(dependencies);
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof LeagueSeasonNotFoundError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.NOT_FOUND,
          message: HttpStatus.getMessage(HttpStatus.NOT_FOUND),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.NOT_FOUND;
        isInstanceof = true;
        break;

      case error instanceof LeagueSeasonStartDateInPastError:
      case error instanceof LeagueSeasonInsufficientPreparationTimeError:
      case error instanceof LeagueSeasonInsufficientDurationError:
      case error instanceof LeagueSeasonEndDateInPastError:
      case error instanceof LeagueSeasonEndDateBeforeStartDateError:
      case error instanceof InvalidLeagueSeasonStatusError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
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
