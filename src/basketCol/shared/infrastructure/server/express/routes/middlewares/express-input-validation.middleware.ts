import { HttpStatus } from '@basketcol/domain';
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

import { HttpResponseHandler } from '../../../../http/HttpResponseHandler';
import { IHttpResponseHandler } from '../../../../../application/http/ports/IHttpResponseHandler';
import { IErrorDetail } from '../../../../../application/http/ports/IErrorApiResponse';

const parseError = (error: ValidationError): IErrorDetail => ({
  name: 'ValidationError',
  details: error.msg,
  field: error.type === 'field' ? error.path : error.type,
});

export const expressInputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  const httpResponseHandler: IHttpResponseHandler = HttpResponseHandler.create();
  const formattedErrors: IErrorDetail[] = errors.array().map(parseError);

  const errorResponse = httpResponseHandler.handleMultipleErrorResponse({
    code: HttpStatus.BAD_REQUEST,
    message: HttpStatus.getMessage(HttpStatus.BAD_REQUEST),
    errors: formattedErrors,
  });

  res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
};
