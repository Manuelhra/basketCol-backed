import { HttpStatus, TeamFounderUserNotFoundError } from '@basketcol/domain';
import { Response } from 'express';

import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { IErrorApiResponse } from '../../../../../shared/application/http/IErrorApiResponse';

export class ExpressTeamFounderUserServerErrorHandler implements IServerErrorHandler {
  protected readonly httpResponseHandler: IHttpResponseHandler;

  public constructor(dependencies: {
    httpResponseHandler: IHttpResponseHandler;
  }) {
    this.httpResponseHandler = dependencies.httpResponseHandler;
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof TeamFounderUserNotFoundError:
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.NOT_FOUND,
          message: HttpStatus.getMessage(HttpStatus.NOT_FOUND),
          errors: { name: error.name, details: error.message },
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
