import { IApiResponse } from './IApiResponse';

export interface IErrorApiResponse extends IApiResponse {
  error: {
    name: string,
    details: string,
  },
}
