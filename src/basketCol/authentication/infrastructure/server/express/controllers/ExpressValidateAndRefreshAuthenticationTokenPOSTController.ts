import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IValidateAndRefreshAuthenticationTokenUseCase } from '../../../../application/use-cases/ports/IValidateAndRefreshAuthenticationTokenUseCase';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  validateAndRefreshAuthenticationTokenUseCase: IValidateAndRefreshAuthenticationTokenUseCase;
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressValidateAndRefreshAuthenticationTokenPOSTController extends ExpressBaseController {
  readonly #validateAndRefreshAuthenticationTokenUseCase: IValidateAndRefreshAuthenticationTokenUseCase;

  readonly #httpResponseHandler: IHttpResponseHandler;

  public constructor(dependencies: Dependencies) {
    super();

    this.#validateAndRefreshAuthenticationTokenUseCase = dependencies.validateAndRefreshAuthenticationTokenUseCase;
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public async run(request: Request, response: Response): Promise<void> {
    const authenticationHeader = request.headers.authorization;

    if (authenticationHeader === undefined || authenticationHeader === null || authenticationHeader.startsWith('Bearer ') === false) {
      const errorResponse = this.#httpResponseHandler.handleSingleErrorResponse({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Authorization header missing or improperly formatted. Please provide a valid Bearer token.',
        error: {
          name: 'UnauthorizedAccessError',
          details: 'The request lacks a valid Bearer token. Access to this resource requires proper authentication.',
        },
      });

      response.status(HttpStatus.UNAUTHORIZED).json(errorResponse);

      return;
    }

    const authenticationToken = authenticationHeader.split(' ')[1];

    const result = await this.#validateAndRefreshAuthenticationTokenUseCase.execute({ authenticationToken });
    const successResult = this.#httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.CREATED,
      message: HttpStatus.getMessage(HttpStatus.CREATED),
      data: {
        newAuthenticationToken: result.newAuthenticationToken,
      },
    });

    response.status(HttpStatus.CREATED).json(successResult);
  }
}
