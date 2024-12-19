import { ILocationValueObjectProps } from '@basketcol/domain';

import { AggregateRootHttpResponseDTO } from '../../../../shared/infrastructure/dtos/AggregateRootHttpResponseDTO';

export interface LeagueHttpResponseDTO extends AggregateRootHttpResponseDTO {
  name: {
    short: string;
    official: string;
  };
  description: {
    short: string;
    complete: string;
  };
  gender: string;
  rules: string;
  level: string;
  location: ILocationValueObjectProps;
  establishmentDate: string;
  leagueFounderUserId: string;
  isActive: boolean;
}
