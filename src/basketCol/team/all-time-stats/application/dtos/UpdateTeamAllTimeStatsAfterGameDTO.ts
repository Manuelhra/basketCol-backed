export interface UpdateTeamAllTimeStatsAfterGameDTO {
  hasWonGame: boolean,
  points: number,
  offensiveRebounds: number,
  defensiveRebounds: number,
  assists: number,
  steals: number,
  blocks: number,
  fouls: number,
  turnovers: number,
  threePointersAttempted: number,
  threePointersMade: number,
  freeThrowsAttempted: number,
  freeThrowsMade: number,
  fieldGoalsAttempted: number,
  fieldGoalsMade: number,
  teamId: string;
}
