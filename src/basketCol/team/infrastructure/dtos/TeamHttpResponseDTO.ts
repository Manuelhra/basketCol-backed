import { IImageValueObjectProps } from '@basketcol/domain/build/types/basketCol/shared/domain/value-objects/ImageValueObject';

import { AggregateRootHttpResponseDTO } from '../../../shared/infrastructure/dtos/AggregateRootHttpResponseDTO';

interface ITeamMainMedia {
  mainImage: IImageValueObjectProps;
  logo: IImageValueObjectProps;
}

interface ITeamGallery {
  gallery: {
    images: Array<IImageValueObjectProps>;
  };
}

export interface TeamHttpResponseDTO extends
  AggregateRootHttpResponseDTO,
  ITeamMainMedia,
  ITeamGallery {
  officialName: string;
  gender: string;
  teamFounderUserId: string;
}
