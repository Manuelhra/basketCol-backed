import { IImageValueObjectProps } from '@basketcol/domain';

import { AggregateRootHttpResponseDTO } from '../../../../shared/infrastructure/dtos/AggregateRootHttpResponseDTO';

interface IUserCredentials {
  email: { value: string; verified: boolean; };
  password: string;
}

interface IUserAccount {
  accountStatus: string;
  subscriptionType: string;
}

interface IUserIdentity {
  name: { firstName: string; lastName: string; };
  gender: string;
  biography: string;
  type: string;
  accountStatus: string;
  subscriptionType: string;
}

interface IUserMedia {
  profileImage: IImageValueObjectProps;
}

export interface UserHttpResponseDTO extends
  AggregateRootHttpResponseDTO,
  IUserCredentials,
  IUserIdentity,
  IUserMedia,
  IUserAccount {}
