export interface CreateLeagueSeasonFixtureDTO {
  id: string;
  date: string;
  name: string | null;
  leagueSeasonId: string;
}
