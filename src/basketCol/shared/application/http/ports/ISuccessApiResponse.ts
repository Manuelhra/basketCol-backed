import { IPaginationParams } from '@basketcol/domain';

import { IApiResponse } from './IApiResponse';

export interface ISuccessApiResponse<T> extends IApiResponse {
  data: T;
  pagination?: IPaginationParams;
}
