import { IImageValueObjectProps } from '@basketcol/domain/build/types/basketCol/shared/domain/value-objects/ImageValueObject';
import { ILocationValueObjectProps } from '@basketcol/domain/build/types/basketCol/shared/domain/value-objects/LocationValueObject';

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
