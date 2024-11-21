export interface CreateLeagueSeasonFixtureGameDTO {
  id: string;
  startTime: string;
  homeTeamId: string;
  awayTeamId: string;
  gameType: string;
  gameDuration: number;
  headRefereeId: string;
  assistantRefereeId: string;
  courtId: string;
  fixtureId: string;
}
