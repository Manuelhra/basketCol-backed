import { IImageValueObjectProps } from '@basketcol/domain/build/types/basketCol/shared/domain/value-objects/ImageValueObject';

export interface CreateTeamDTO {
  id: string;
  officialName: string;
  gender: string;
  mainImage: IImageValueObjectProps;
  gallery: {
    images: IImageValueObjectProps[];
  };
  teamFounderUserId: string;
}
