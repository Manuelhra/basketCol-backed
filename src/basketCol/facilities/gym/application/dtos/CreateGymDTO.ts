import { IImageValueObjectProps } from '@basketcol/domain/build/types/basketCol/shared/domain/value-objects/ImageValueObject';
import { ILocationValueObjectProps } from '@basketcol/domain/build/types/basketCol/shared/domain/value-objects/LocationValueObject';

export interface CreateGymDTO {
  id: string;
  officialName: string;
  location: ILocationValueObjectProps;
  establishmentDate: string;
  registeredById: string;
  mainImage: IImageValueObjectProps;
  gallery: {
    images: IImageValueObjectProps[];
  };
}
