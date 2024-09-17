import { IErrorApiResponse, IErrorDetail } from '../../application/http/IErrorApiResponse';
import { IHttpResponseHandler } from '../../application/http/IHttpResponseHandler';
import { ISuccessApiResponse } from '../../application/http/ISuccessApiResponse';

export class HttpResponseHandler implements IHttpResponseHandler {
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
    errors: IErrorDetail | IErrorDetail[];
  }): IErrorApiResponse {
    return {
      code: body.code,
      message: body.message,
      errors: body.errors,
    };
  }
}
