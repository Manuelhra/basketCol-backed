import { IImageValueObjectProps } from '@basketcol/domain/build/types/basketCol/shared/domain/value-objects/ImageValueObject';

export interface CreatePlayerUserDTO {
  id: string;
  name: { firstName: string; lastName: string; };
  biography: string;
  nickname: string;
  email: { value: string; };
  password: string;
  profileImage: IImageValueObjectProps;
}
