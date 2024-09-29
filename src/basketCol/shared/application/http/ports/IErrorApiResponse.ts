import { IApiResponse } from './IApiResponse';

export interface IErrorDetail {
  field?: string;
  name: string;
  details: string;
}

export type IErrorApiResponse = IApiResponse & (
  | { type: 'single'; error: IErrorDetail }
  | { type: 'multiple'; errors: IErrorDetail[] }
);
