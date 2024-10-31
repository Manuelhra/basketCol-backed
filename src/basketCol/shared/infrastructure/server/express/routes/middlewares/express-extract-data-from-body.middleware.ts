import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../application/http/ports/IHttpResponseHandler';

export const expressExtractDataFromBodyMiddleware = (httpResponseHandler: IHttpResponseHandler) => (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (request.body.data === undefined) {
    const errorResponse = httpResponseHandler.handleSingleErrorResponse({
      code: HttpStatus.BAD_REQUEST,
      message: 'No data found in the request body, remember to send the json in the "data" field',
      error: {
        name: 'InvalidRequestError',
        details: 'The request body must contain a "data" field with the json data to be processed',
      },
    });

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }

  request.body = JSON.parse(request.body.data);
  next();
};
