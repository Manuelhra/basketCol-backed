import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IGetAuthenticatedUserUseCase } from '../../../../application/use-cases/ports/IGetAuthenticatedUserUseCase';

type Dependencies = {
  getAuthenticatedUserUseCase: IGetAuthenticatedUserUseCase;
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressGetAuthenticatedUserGETController extends ExpressBaseController {
  readonly #getAuthenticatedUserUseCase: IGetAuthenticatedUserUseCase;

  readonly #httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    super();

    this.#getAuthenticatedUserUseCase = dependencies.getAuthenticatedUserUseCase;
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressGetAuthenticatedUserGETController {
    return new ExpressGetAuthenticatedUserGETController(dependencies);
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

    const result = await this.#getAuthenticatedUserUseCase.execute({ authenticationToken });
    const successResult = this.#httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        authenticatedUser: result.authenticatedUser.toPrimitives,
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
