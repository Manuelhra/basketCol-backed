import { ILocationValueObjectProps, IImageValueObjectProps } from '@basketcol/domain';

export interface CreateCourtDTO {
  id: string;
  officialName: string;
  establishmentDate: string;
  surface: string;
  hoopHeight: number;
  location: ILocationValueObjectProps;
  mainImage: IImageValueObjectProps;
  gallery: {
    images: IImageValueObjectProps[];
  };
  facilityId: string | null;
}
