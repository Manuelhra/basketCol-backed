import { ILocationValueObjectProps } from '@basketcol/domain/build/types/basketCol/shared/domain/value-objects/LocationValueObject';

export interface CreateLeagueDTO {
  id: string;
  name: {
    short: string;
    official: string;
  };
  description: {
    short: string;
    complete: string;
  };
  rules: string;
  level: string;
  location: ILocationValueObjectProps;
  establishmentDate: string;
  leagueFounderUserId: string;
}
