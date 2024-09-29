import { IErrorApiResponse, IErrorDetail } from './IErrorApiResponse';
import { ISuccessApiResponse } from './ISuccessApiResponse';

export interface IHttpResponseHandler {
  handleSuccessResponse<T>(payload: {
    code: number;
    message: string;
    data: T;
  }): ISuccessApiResponse<T>;

  handleSingleErrorResponse(payload: {
    code: number;
    message: string;
    error: IErrorDetail;
  }): IErrorApiResponse;

  handleMultipleErrorResponse(payload: {
    code: number;
    message: string;
    errors: IErrorDetail[];
  }): IErrorApiResponse;
}
