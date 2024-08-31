export interface CreateLeagueSeasonFixtureGameDTO {
  id: string;
  startTime: string;
  endTime: string | undefined;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  gameType: string;
  gameDuration: number;
  headRefereeId: string;
  assistantRefereeId: string;
  courtId: string;
  fixtureId: string;
}
