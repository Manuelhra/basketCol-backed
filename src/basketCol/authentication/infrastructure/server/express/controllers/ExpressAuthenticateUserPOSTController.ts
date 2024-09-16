import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { IAuthenticateUserUseCase } from '../../../../application/use-cases/ports/IAuthenticateUserUseCase';
import { AuthenticateUserDTO } from '../../../../application/dtos/AuthenticateUserDTO';
import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';

export class ExpressAuthenticateUserPOSTController extends ExpressBaseController {
  readonly #authenticateUserUseCase: IAuthenticateUserUseCase;

  readonly #httpResponseHandler: IHttpResponseHandler;

  public constructor(dependencies: {
    authenticateUserUseCase: IAuthenticateUserUseCase;
    httpResponseHandler: IHttpResponseHandler;
  }) {
    super();

    this.#authenticateUserUseCase = dependencies.authenticateUserUseCase;
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public async run(request: Request, response: Response): Promise<void> {
    const authenticateUserDTO: AuthenticateUserDTO = request.body;

    const result = await this.#authenticateUserUseCase.execute(authenticateUserDTO);
    const successResult = this.#httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: result,
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
