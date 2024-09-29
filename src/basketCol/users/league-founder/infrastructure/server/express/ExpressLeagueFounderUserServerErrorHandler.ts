import { HttpStatus, LeagueFounderUserNotFoundError } from '@basketcol/domain';
import { Response } from 'express';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IErrorApiResponse } from '../../../../../shared/application/http/ports/IErrorApiResponse';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';

type Dependencies = {
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressLeagueFounderUserServerErrorHandler implements IServerErrorHandler {
  protected readonly httpResponseHandler: IHttpResponseHandler;

  public constructor(dependencies: Dependencies) {
    this.httpResponseHandler = dependencies.httpResponseHandler;
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof LeagueFounderUserNotFoundError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
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
