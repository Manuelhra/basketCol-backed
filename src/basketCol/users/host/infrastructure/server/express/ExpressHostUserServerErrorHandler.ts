import { HostUserNotFoundError, HttpStatus } from '@basketcol/domain';
import { Response } from 'express';

import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { IErrorApiResponse } from '../../../../../shared/application/http/IErrorApiResponse';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { MultipleHostUsersException } from '../../../application/exceptions/MultipleHostUsersException';
import { InvalidHostUserCredentialsError } from '../../../application/exceptions/InvalidHostUserCredentialsError';

export class ExpressHostUserServerErrorHandler implements IServerErrorHandler {
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
      case error instanceof MultipleHostUsersException:
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: HttpStatus.getMessage(HttpStatus.INTERNAL_SERVER_ERROR),
          errors: { name: error.name, details: error.message },
        });
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        isInstanceof = true;
        break;

      case error instanceof HostUserNotFoundError:
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.NOT_FOUND,
          message: HttpStatus.getMessage(HttpStatus.NOT_FOUND),
          errors: { name: error.name, details: error.message },
        });
        status = HttpStatus.NOT_FOUND;
        isInstanceof = true;
        break;

      case error instanceof InvalidHostUserCredentialsError:
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.UNAUTHORIZED,
          message: HttpStatus.getMessage(HttpStatus.UNAUTHORIZED),
          errors: { name: error.name, details: error.message },
        });
        status = HttpStatus.UNAUTHORIZED;
        isInstanceof = true;
        break;
    }

    if (isInstanceof && status !== null && errorResponse !== null) {
      response.status(status).json(errorResponse);
    }
  }
}
