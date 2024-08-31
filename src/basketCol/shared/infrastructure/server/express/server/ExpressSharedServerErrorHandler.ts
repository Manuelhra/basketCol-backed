import {
  DatabaseConnectionFailedError,
  DateGreaterThanError,
  DependencyContainerNotInitializedError,
  DuplicateIdError,
  HttpStatus,
} from '@basketcol/domain';
import { Response } from 'express';

import { IHttpResponseHandler } from '../../../../application/http/IHttpResponseHandler';
import { IServerErrorHandle } from '../../IServerErrorHandler';
import { IErrorApiResponse } from '../../../../application/http/IErrorApiResponse';

export class ExpressSharedServerErrorHandler implements IServerErrorHandle<Response> {
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
      case error instanceof DependencyContainerNotInitializedError:
      case error instanceof DatabaseConnectionFailedError:
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: HttpStatus.getMessage(HttpStatus.INTERNAL_SERVER_ERROR),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        isInstanceof = true;
        break;

      case error instanceof DateGreaterThanError:
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.BAD_REQUEST,
          message: HttpStatus.getMessage(HttpStatus.BAD_REQUEST),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.BAD_REQUEST;
        isInstanceof = true;
        break;

      case error instanceof DuplicateIdError:
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.CONFLICT,
          message: HttpStatus.getMessage(HttpStatus.CONFLICT),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.CONFLICT;
        isInstanceof = true;
        break;
    }

    if (isInstanceof && status !== null && errorResponse !== null) {
      response.status(status).json(errorResponse);
    }
  }
}
