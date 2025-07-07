import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { RequestPasswordResetUseCase } from '../../../../application/use-cases/RequestPasswordResetUseCase';
import { RequestPasswordResetDTO } from '../../../../application/dtos/RequestPasswordResetDTO';

type Dependencies = {
  readonly requestPasswordResetUseCase: RequestPasswordResetUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressRequestPasswordResetPOSTController
  extends ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public static create(dependencies: Dependencies): ExpressRequestPasswordResetPOSTController {
    return new ExpressRequestPasswordResetPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const requestPasswordResetDTO: RequestPasswordResetDTO = request.body;

    await this.dependencies.requestPasswordResetUseCase.execute(requestPasswordResetDTO);

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.NO_CONTENT,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: null,
    });

    response.status(HttpStatus.NO_CONTENT).json(successResult);
  }
}
