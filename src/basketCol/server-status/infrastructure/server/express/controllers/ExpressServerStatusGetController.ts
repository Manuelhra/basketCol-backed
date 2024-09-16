import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';

export class ExpressServerStatusGETController extends ExpressBaseController {
  readonly #httpResponseHandler: IHttpResponseHandler;

  public constructor(dependencies: {
    httpResponseHandler: IHttpResponseHandler;
  }) {
    super();

    this.#httpResponseHandler = dependencies.httpResponseHandler;
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
