export interface CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO {
  id: string;
  points: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fouls: number;
  turnovers: number;
  threePointersAttempted: number;
  threePointersMade: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  fieldGoalsAttempted: number;
  fieldGoalsMade: number;
  fixtureGameId: string;
  playerUserId: string;
}
