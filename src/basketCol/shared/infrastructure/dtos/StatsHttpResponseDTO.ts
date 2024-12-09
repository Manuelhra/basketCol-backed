import { AggregateRootHttpResponseDTO } from './AggregateRootHttpResponseDTO';

interface IStatsBasic {
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalSeasonsLeaguePlayed: number;
  totalSeasonsLeagueWon: number;
  totalPoints: number;
  totalOffensiveRebounds: number;
  totalDefensiveRebounds: number;
  totalAssists: number;
  totalSteals: number;
  totalBlocks: number;
  totalFouls: number;
  totalTurnovers: number;
}

interface IStatsShooting {
  totalThreePointersAttempted: number;
  totalThreePointersMade: number;
  totalFreeThrowsAttempted: number;
  totalFreeThrowsMade: number;
  totalFieldGoalsAttempted: number;
  totalFieldGoalsMade: number;
}

export interface StatsHttpResponseDTO extends AggregateRootHttpResponseDTO, IStatsBasic, IStatsShooting {}
