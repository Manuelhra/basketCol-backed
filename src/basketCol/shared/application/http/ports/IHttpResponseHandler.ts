import { IErrorApiResponse, IErrorDetail } from './IErrorApiResponse';
import { ISuccessApiResponse } from './ISuccessApiResponse';

export interface IHttpResponseHandler {
  handleSuccessResponse<T>(payload: { code: number; message: string; data: T; }): ISuccessApiResponse<T>;
  handleErrorResponse(payload: { code: number; message: string; errors: IErrorDetail | IErrorDetail[] }): IErrorApiResponse;
}
