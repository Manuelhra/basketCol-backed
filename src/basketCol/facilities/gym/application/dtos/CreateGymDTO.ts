import { ILocationValueObjectProps, IImageValueObjectProps } from '@basketcol/domain';

export interface CreateGymDTO {
  id: string;
  officialName: string;
  location: ILocationValueObjectProps;
  establishmentDate: string;
  mainImage: IImageValueObjectProps;
  gallery: {
    images: IImageValueObjectProps[];
  };
}
