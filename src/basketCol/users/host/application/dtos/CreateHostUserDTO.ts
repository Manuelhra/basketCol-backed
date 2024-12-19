import { IImageValueObjectProps } from '@basketcol/domain';

export interface CreateHostUserDTO {
  id: string;
  name: { firstName: string; lastName: string; };
  biography: string;
  email: { value: string; };
  password: string;
  profileImage: IImageValueObjectProps
}
