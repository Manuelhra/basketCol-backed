import { HttpStatus } from '@basketcol/domain';
import { NextFunction, Request, Response } from 'express';

import { IHttpResponseHandler } from '../../../../../application/http/IHttpResponseHandler';

export const expressUserTypeAuthorizationMiddleware = (
  allowedUserTypes: string[],
  httpResponseHandler: IHttpResponseHandler,
) => (request: Request, response: Response, next: NextFunction): void => {
  const { userContext } = request;

  if (userContext === undefined || userContext === null) {
    const errorResponse = httpResponseHandler.handleErrorResponse({
      code: HttpStatus.UNAUTHORIZED,
      message: 'Authentication required. Please log in to access this resource.',
      errors: {
        name: 'UnauthorizedAccessError',
        details: 'The request lacks valid authentication. Please ensure you are logged in before accessing this resource.',
      },
    });

    response.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
    return;
  }

  if (allowedUserTypes.includes(userContext.userType) === false) {
    const errorResponse = httpResponseHandler.handleErrorResponse({
      code: HttpStatus.FORBIDDEN,
      message: 'Insufficient permissions to access this resource.',
      errors: {
        name: 'InsufficientPermissionsError',
        details: `Your user type (${userContext.userType}) does not have the necessary permissions to access this resource. Required user types: ${allowedUserTypes.join(', ')}.`,
      },
    });

    response.status(HttpStatus.FORBIDDEN).json(errorResponse);
    return;
  }

  next();
};
