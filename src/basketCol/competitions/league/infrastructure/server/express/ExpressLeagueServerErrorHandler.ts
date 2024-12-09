import {
  DuplicateLeagueNameError,
  HttpStatus,
  LeagueNotFoundError,
} from '@basketcol/domain';
import { Response } from 'express';

import { IErrorApiResponse } from '../../../../../shared/application/http/ports/IErrorApiResponse';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { FounderNotFoundForLeagueError } from '../../../application/exceptions/FounderNotFoundForLeagueError';

type Dependencies = {
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressLeagueServerErrorHandler implements IServerErrorHandler {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressLeagueServerErrorHandler {
    return new ExpressLeagueServerErrorHandler(dependencies);
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof DuplicateLeagueNameError:
        errorResponse = this.dependencies.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.CONFLICT,
          message: HttpStatus.getMessage(HttpStatus.CONFLICT),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.CONFLICT;
        isInstanceof = true;
        break;

      case error instanceof FounderNotFoundForLeagueError:
      case error instanceof LeagueNotFoundError:
        errorResponse = this.dependencies.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.NOT_FOUND,
          message: HttpStatus.getMessage(HttpStatus.NOT_FOUND),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.NOT_FOUND;
        isInstanceof = true;
        break;
    }

    if (isInstanceof && status !== null && errorResponse !== null) {
      response.status(status).json(errorResponse);
    }
  }
}
