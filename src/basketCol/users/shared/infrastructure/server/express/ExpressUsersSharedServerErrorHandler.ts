import {
  EmailAlreadyExistsError,
  HttpStatus,
  InvalidEmailPolicyError,
  InvalidUserTypeError,
  PasswordPolicyViolationError,
} from '@basketcol/domain';
import { Response } from 'express';

import { IErrorApiResponse } from '../../../../../shared/application/http/ports/IErrorApiResponse';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { UserNotFoundError } from '../../../application/exceptions/UserNotFoundError';
import { ImageUploadError } from '../../exceptions/ImageUploadError';

type Dependencies = {
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressUsersSharedServerErrorHandler implements IServerErrorHandler {
  protected readonly httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    this.httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressUsersSharedServerErrorHandler {
    return new ExpressUsersSharedServerErrorHandler(dependencies);
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof EmailAlreadyExistsError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.CONFLICT,
          message: HttpStatus.getMessage(HttpStatus.CONFLICT),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.CONFLICT;
        isInstanceof = true;
        break;

      case error instanceof UserNotFoundError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.NOT_FOUND,
          message: HttpStatus.getMessage(HttpStatus.NOT_FOUND),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.NOT_FOUND;
        isInstanceof = true;
        break;

      case error instanceof ImageUploadError:
      case error instanceof PasswordPolicyViolationError:
      case error instanceof InvalidUserTypeError:
      case error instanceof InvalidEmailPolicyError:
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
