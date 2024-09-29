import { HttpStatus } from '@basketcol/domain';
import { Response } from 'express';

import { IServerErrorHandler } from '../../../../shared/infrastructure/server/IServerErrorHandler';
import { IErrorApiResponse } from '../../../../shared/application/http/ports/IErrorApiResponse';
import { InvalidCredentialsError } from '../../../application/exceptions/InvalidCredentialsError';
import { IHttpResponseHandler } from '../../../../shared/application/http/ports/IHttpResponseHandler';
import { MissingCredentialsError } from '../../../application/exceptions/MissingCredentialsError';
import { MissingEmailError } from '../../../application/exceptions/MissingEmailError';
import { InvalidAuthenticationTokenError } from '../../../application/exceptions/InvalidAuthenticationTokenError';

type Dependencies = {
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressAuthenticationServerErrorHandler implements IServerErrorHandler {
  readonly #httpResponseHandler: IHttpResponseHandler;

  public constructor(dependencies: Dependencies) {
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof InvalidAuthenticationTokenError:
        errorResponse = this.#httpResponseHandler.handleErrorResponse({
          code: HttpStatus.UNAUTHORIZED,
          message: HttpStatus.getMessage(HttpStatus.UNAUTHORIZED),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.UNAUTHORIZED;
        isInstanceof = true;
        break;

      case error instanceof MissingEmailError:
      case error instanceof MissingCredentialsError:
      case error instanceof InvalidCredentialsError:
        errorResponse = this.#httpResponseHandler.handleErrorResponse({
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
