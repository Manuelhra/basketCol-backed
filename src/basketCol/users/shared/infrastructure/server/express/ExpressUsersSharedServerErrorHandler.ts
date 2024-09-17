import {
  EmailAlreadyExistsError,
  HttpStatus,
  InvalidEmailPolicyError,
  InvalidUserTypeError,
  PasswordPolicyViolationError,
} from '@basketcol/domain';
import { Response } from 'express';

import { IErrorApiResponse } from '../../../../../shared/application/http/IErrorApiResponse';
import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';

export class ExpressUsersSharedServerErrorHandler implements IServerErrorHandler {
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
      case error instanceof EmailAlreadyExistsError:
        errorResponse = this.httpResponseHandler.handleErrorResponse({
          code: HttpStatus.CONFLICT,
          message: HttpStatus.getMessage(HttpStatus.CONFLICT),
          errors: { name: error.name, details: error.message },
        });
        status = HttpStatus.CONFLICT;
        isInstanceof = true;
        break;

      case error instanceof PasswordPolicyViolationError:
      case error instanceof InvalidUserTypeError:
      case error instanceof InvalidEmailPolicyError:
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
