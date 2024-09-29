import { IErrorApiResponse, IErrorDetail } from '../../application/http/ports/IErrorApiResponse';
import { IHttpResponseHandler } from '../../application/http/ports/IHttpResponseHandler';
import { ISuccessApiResponse } from '../../application/http/ports/ISuccessApiResponse';

export class HttpResponseHandler implements IHttpResponseHandler {
  public static create(): HttpResponseHandler {
    return new HttpResponseHandler();
  }

  public handleSuccessResponse<T>(body: { code: number; message: string; data: T; }): ISuccessApiResponse<T> {
    return {
      code: body.code,
      message: body.message,
      data: body.data,
    };
  }

  public handleErrorResponse(body: {
    code: number;
    message: string;
    error?: IErrorDetail;
    errors?: IErrorDetail[];
  }): IErrorApiResponse {
    return {
      code: body.code,
      message: body.message,
      error: body.error,
      errors: body.errors,
    };
  }
}
