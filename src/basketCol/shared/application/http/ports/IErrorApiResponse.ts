import { IApiResponse } from './IApiResponse';

export interface IErrorDetail {
  field?: string;
  name: string;
  details: string;
}

export interface IErrorApiResponse extends IApiResponse {
  error?: IErrorDetail;
  errors?: IErrorDetail[];
}
