import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { IAuthenticateUserUseCase } from '../../../../application/use-cases/ports/IAuthenticateUserUseCase';
import { AuthenticateUserDTO } from '../../../../application/dtos/AuthenticateUserDTO';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';

type Dependencies = {
  readonly authenticateUserUseCase: IAuthenticateUserUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressAuthenticateUserPOSTController extends ExpressBaseController {
  readonly #authenticateUserUseCase: IAuthenticateUserUseCase;

  readonly #httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    super();

    this.#authenticateUserUseCase = dependencies.authenticateUserUseCase;
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressAuthenticateUserPOSTController {
    return new ExpressAuthenticateUserPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const authenticateUserDTO: AuthenticateUserDTO = request.body;

    const result = await this.#authenticateUserUseCase.execute(authenticateUserDTO);
    const successResult = this.#httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        authenticatedUser: result.authenticatedUser.toPrimitives,
        authenticationToken: result.authenticationToken,
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
