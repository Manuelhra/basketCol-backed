import { IImageValueObjectProps } from '@basketcol/domain';

export interface CreatePlayerUserDTO {
  id: string;
  name: { firstName: string; lastName: string; };
  biography: string;
  gender: string;
  nickname: string;
  email: { value: string; };
  password: string;
  profileImage: IImageValueObjectProps;
}
