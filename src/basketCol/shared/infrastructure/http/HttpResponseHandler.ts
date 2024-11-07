import { IPaginationParams } from '@basketcol/domain';
import {
  IErrorApiResponse,
  IErrorDetail,
} from '../../application/http/ports/IErrorApiResponse';
import { IHttpResponseHandler } from '../../application/http/ports/IHttpResponseHandler';
import { ISuccessApiResponse } from '../../application/http/ports/ISuccessApiResponse';

export class HttpResponseHandler implements IHttpResponseHandler {
  public static create(): HttpResponseHandler {
    return new HttpResponseHandler();
  }

  public handleSuccessResponse<T>(payload: {
    code: number;
    message: string;
    data: T;
    paginationParams?: IPaginationParams; }): ISuccessApiResponse<T> {
    return {
      code: payload.code,
      message: payload.message,
      data: payload.data,
      pagination: payload.paginationParams,
    };
  }

  public handleSingleErrorResponse(payload: {
    code: number;
    message: string;
    error: IErrorDetail;
  }): IErrorApiResponse {
    return {
      code: payload.code,
      message: payload.message,
      type: 'single',
      error: payload.error,
    };
  }

  public handleMultipleErrorResponse(payload: {
    code: number;
    message: string;
    errors: IErrorDetail[];
  }): IErrorApiResponse {
    return {
      code: payload.code,
      message: payload.message,
      type: 'multiple',
      errors: payload.errors,
    };
  }
}
