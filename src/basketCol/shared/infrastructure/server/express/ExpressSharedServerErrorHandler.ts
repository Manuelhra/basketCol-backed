import {
  CreateMethodNotImplementedError,
  DateGreaterThanError,
  DuplicateIdError,
  ElementAlreadyDisabledError,
  EmptyCourtIdListError,
  EmptyGymIdListError,
  EntityNotFoundError,
  HttpStatus,
  IdAlreadyExistsError,
  InvalidCentimeterHeightError,
  InvalidCourtIdInstanceError,
  InvalidCourtIdListElementError,
  InvalidDateFormatError,
  InvalidDomainIdError,
  InvalidEnumValueError,
  InvalidFacilityIdInstanceError,
  InvalidGenderError,
  InvalidGymIdListElementError,
  InvalidHostUserIdInstanceError,
  InvalidLeagueFounderUserIdInstanceError,
  InvalidLeagueIdInstanceError,
  InvalidLeagueSeasonIdInstanceError,
  InvalidMinutesDurationError,
  InvalidPlayerUserIdInstanceError,
  InvalidPropertyTypeError,
  InvalidRefereeUserIdInstanceError,
  InvalidTeamFounderUserIdInstanceError,
  InvalidTeamIdInstanceError,
  InvalidTimeFormatError,
  InvalidValueObjectConfigurationError,
  MaximumValueExceededError,
  MethodNotImplementedError,
  MinimumValueViolationError,
  NotIntegerError,
  NullValueError,
  PropertyLengthExceededError,
  PropertyLengthTooShortError,
  UndefinedValueError,
} from '@basketcol/domain';
import { Response } from 'express';

import { IHttpResponseHandler } from '../../../application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../IServerErrorHandler';
import { IErrorApiResponse } from '../../../application/http/ports/IErrorApiResponse';
import { DatabaseConnectionFailedError } from '../../exceptions/DatabaseConnectionFailedError';
import { DependencyContainerNotInitializedError } from '../../exceptions/DependencyContainerNotInitializedError';
import { UnauthorizedAccessError } from '../../../application/exceptions/UnauthorizedAccessError';
import { MulterError } from '../../exceptions/MulterError';

type Dependencies = {
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressSharedServerErrorHandler implements IServerErrorHandler {
  protected readonly httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    this.httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressSharedServerErrorHandler {
    return new ExpressSharedServerErrorHandler(dependencies);
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof MethodNotImplementedError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.NOT_IMPLEMENTED,
          message: HttpStatus.getMessage(HttpStatus.NOT_IMPLEMENTED),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.NOT_IMPLEMENTED;
        isInstanceof = true;
        break;

      case error instanceof InvalidValueObjectConfigurationError:
      case error instanceof DependencyContainerNotInitializedError:
      case error instanceof DatabaseConnectionFailedError:
      case error instanceof CreateMethodNotImplementedError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: HttpStatus.getMessage(HttpStatus.INTERNAL_SERVER_ERROR),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        isInstanceof = true;
        break;

      case error instanceof IdAlreadyExistsError:
      case error instanceof DuplicateIdError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.CONFLICT,
          message: HttpStatus.getMessage(HttpStatus.CONFLICT),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.CONFLICT;
        isInstanceof = true;
        break;

      case error instanceof EntityNotFoundError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.NOT_FOUND,
          message: HttpStatus.getMessage(HttpStatus.NOT_FOUND),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.NOT_FOUND;
        isInstanceof = true;
        break;

      case error instanceof UnauthorizedAccessError: {
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.UNAUTHORIZED,
          message: HttpStatus.getMessage(HttpStatus.UNAUTHORIZED),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.UNAUTHORIZED;
        isInstanceof = true;
        break;
      }

      case error instanceof InvalidGenderError:
      case error instanceof MulterError:
      case error instanceof InvalidEnumValueError:
      case error instanceof UndefinedValueError:
      case error instanceof PropertyLengthTooShortError:
      case error instanceof PropertyLengthExceededError:
      case error instanceof NullValueError:
      case error instanceof NotIntegerError:
      case error instanceof MinimumValueViolationError:
      case error instanceof MaximumValueExceededError:
      case error instanceof InvalidTimeFormatError:
      case error instanceof InvalidTeamIdInstanceError:
      case error instanceof InvalidTeamFounderUserIdInstanceError:
      case error instanceof InvalidRefereeUserIdInstanceError:
      case error instanceof InvalidPropertyTypeError:
      case error instanceof InvalidPlayerUserIdInstanceError:
      case error instanceof InvalidMinutesDurationError:
      case error instanceof InvalidLeagueSeasonIdInstanceError:
      case error instanceof InvalidLeagueIdInstanceError:
      case error instanceof InvalidLeagueFounderUserIdInstanceError:
      case error instanceof InvalidHostUserIdInstanceError:
      case error instanceof InvalidGymIdListElementError:
      case error instanceof InvalidFacilityIdInstanceError:
      case error instanceof InvalidDomainIdError:
      case error instanceof InvalidDateFormatError:
      case error instanceof InvalidCourtIdListElementError:
      case error instanceof InvalidCourtIdInstanceError:
      case error instanceof InvalidCentimeterHeightError:
      case error instanceof EmptyGymIdListError:
      case error instanceof EmptyCourtIdListError:
      case error instanceof ElementAlreadyDisabledError:
      case error instanceof DateGreaterThanError:
        errorResponse = this.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.BAD_REQUEST,
          message: HttpStatus.getMessage(HttpStatus.BAD_REQUEST),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.BAD_REQUEST;
        isInstanceof = true;
        break;
    }

    if (isInstanceof && status !== null && errorResponse !== null) {
      response.status(status).json(errorResponse);
    }
  }
}
