import { IImageValueObjectProps } from '@basketcol/domain';

export interface CreateLeagueFounderUserDTO {
  id: string;
  name: { firstName: string; lastName: string; };
  biography: string;
  gender: string;
  email: { value: string; };
  password: string;
  profileImage: IImageValueObjectProps;
}
