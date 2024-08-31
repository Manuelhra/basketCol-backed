export interface CreateLeagueSeasonDTO {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  courtIdList: string[];
  leagueId: string;
}
