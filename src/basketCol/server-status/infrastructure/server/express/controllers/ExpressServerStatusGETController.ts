import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';

type Dependencies = {
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressServerStatusGETController extends ExpressBaseController {
  readonly #httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    super();

    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressServerStatusGETController {
    return new ExpressServerStatusGETController(dependencies);
  }

  public async run(_request: Request, response: Response): Promise<void> {
    const successResult = this.#httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: 'Server is running',
      data: null,
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
