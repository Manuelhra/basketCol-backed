import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { IHttpResponseHandler } from '../../../../../shared/application/http/IHttpResponseHandler';
import { IController } from '../../../../../shared/infrastructure/server/controllers/IController';

export class ExpressServerStatusGetController implements IController<Request, Response> {
  readonly #httpResponseHandler: IHttpResponseHandler;

  public constructor(dependencies: {
    httpResponseHandler: IHttpResponseHandler;
  }) {
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public async run(_request: Request, response: Response): Promise<void> {
    const successResponse = this.#httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: 'Server is running',
      data: null,
    });

    response.status(HttpStatus.OK).json(successResponse);
  }
}
