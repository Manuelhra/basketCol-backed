import { ILocationValueObjectProps } from '@basketcol/domain';

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
  gender: string,
  rules: string;
  level: string;
  location: ILocationValueObjectProps;
  establishmentDate: string;
  leagueFounderUserId: string;
}
