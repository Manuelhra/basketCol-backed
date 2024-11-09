export interface CreateLeagueSeasonFixtureGameDTO {
  id: string;
  startTime: string;
  endTime: string | null;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  gameType: string;
  gameDuration: number;
  quarter: number | null;
  overtime: boolean;
  overtimeNumber: number | null;
  gameStatus: string;
  headRefereeId: string;
  assistantRefereeId: string;
  courtId: string;
  fixtureId: string;
}
