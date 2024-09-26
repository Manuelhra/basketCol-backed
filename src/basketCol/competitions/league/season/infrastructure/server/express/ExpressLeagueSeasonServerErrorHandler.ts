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

import { IErrorApiResponse } from '../../../../../../shared/application/http/IErrorApiResponse';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../../shared/infrastructure/server/IServerErrorHandler';

type Dependencies = {
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressLeagueSeasonServerErrorHandler implements IServerErrorHandler {
  protected readonly httpResponseHandler: IHttpResponseHandler;

  public constructor(dependencies: Dependencies) {
    this.httpResponseHandler = dependencies.httpResponseHandler;
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof LeagueSeasonNotFoundError:
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.NOT_FOUND,
          message: HttpStatus.getMessage(HttpStatus.NOT_FOUND),
          errors: { name: error.name, details: error.message },
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
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.BAD_REQUEST,
          message: HttpStatus.getMessage(HttpStatus.BAD_REQUEST),
          errors: { name: error.name, details: error.message },
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
