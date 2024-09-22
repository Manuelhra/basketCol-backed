import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ITokenValidatorService } from '../../../../../../authentication/application/services/ITokenValidatorService';
import { IHttpResponseHandler } from '../../../../../application/http/IHttpResponseHandler';
import { IUserContext } from '../../../../../application/context/IUserContext';

declare module 'express' {
  interface Request {
    userContext?: IUserContext;
  }
}

export const expressAuthenticationMiddleware = (
  tokenValidatorService: ITokenValidatorService,
  httpResponseHandler: IHttpResponseHandler,
) => (request: Request, response: Response, next: NextFunction): void => {
  const authenticationHeader = request.headers.authorization;

  if (authenticationHeader === undefined || authenticationHeader === null || authenticationHeader.startsWith('Bearer ') === false) {
    const errorResponse = httpResponseHandler.handleErrorResponse({
      code: HttpStatus.UNAUTHORIZED,
      message: 'Authorization header missing or improperly formatted. Please provide a valid Bearer token.',
      errors: {
        name: 'UnauthorizedAccessError',
        details: 'The request lacks a valid Bearer token. Access to this resource requires proper authentication.',
      },
    });

    response.status(HttpStatus.UNAUTHORIZED).json(errorResponse);

    return;
  }

  const authenticationToken = authenticationHeader.split(' ')[1];
  const userContext = tokenValidatorService.validateAuthenticationToken(authenticationToken);

  if (userContext === null) {
    const errorResponse = httpResponseHandler.handleErrorResponse({
      code: HttpStatus.UNAUTHORIZED,
      message: 'Invalid or expired token. Please provide a valid Bearer token.',
      errors: {
        name: 'UnauthorizedAccessError',
        details: 'The token provided is invalid or expired. Ensure that your token is correct and not expired.',
      },
    });

    response.status(HttpStatus.UNAUTHORIZED).json(errorResponse);

    return;
  }

  request.userContext = userContext;

  next();
};
