import { IImageValueObjectProps } from '@basketcol/domain';

export interface CreateTeamDTO {
  id: string;
  officialName: string;
  gender: string;
  logo: IImageValueObjectProps;
  mainImage: IImageValueObjectProps;
  gallery: {
    images: IImageValueObjectProps[];
  };
  teamFounderUserId: string;
}
