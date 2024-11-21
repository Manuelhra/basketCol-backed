import { Schema } from 'mongoose';

import { IMongooseTeamAllTimeStatsDocument } from './IMongooseTeamAllTimeStatsDocument';

export const mongooseTeamAllTimeStatsSchema = new Schema<IMongooseTeamAllTimeStatsDocument>({
  id: {
    type: String,
    required: [true, 'The team all-time stats id is required'],
    unique: true,
  },
  teamId: {
    type: String,
    required: [true, 'The team all-time stats team id is required'],
  },
  totalAssists: {
    type: Number,
    required: [true, 'The team all-time stats total assists is required'],
  },
  totalBlocks: {
    type: Number,
    required: [true, 'The team all-time stats total blocks is required'],
  },
  totalDefensiveRebounds: {
    type: Number,
    required: [true, 'The team all-time stats total defensive rebounds is required'],
  },
  totalFieldGoalsAttempted: {
    type: Number,
    required: [true, 'The team all-time stats total field goals attempted is required'],
  },
  totalFieldGoalsMade: {
    type: Number,
    required: [true, 'The team all-time stats total field goals made is required'],
  },
  totalFouls: {
    type: Number,
    required: [true, 'The team all-time stats total fouls is required'],
  },
  totalFreeThrowsAttempted: {
    type: Number,
    required: [true, 'The team all-time stats total free throws attempted is required'],
  },
  totalFreeThrowsMade: {
    type: Number,
    required: [true, 'The team all-time stats total free throws made is required'],
  },
  totalGamesWon: {
    type: Number,
    required: [true, 'The team all-time stats total games won is required'],
  },
  totalGamesPlayed: {
    type: Number,
    required: [true, 'The team all-time stats total games played is required'],
  },
  totalOffensiveRebounds: {
    type: Number,
    required: [true, 'The team all-time stats total offensive rebounds is required'],
  },
  totalPoints: {
    type: Number,
    required: [true, 'The team all-time stats total points is required'],
  },
  totalSeasonsLeaguePlayed: {
    type: Number,
    required: [true, 'The team all-time stats total seasons league played is required'],
  },
  totalSeasonsLeagueWon: {
    type: Number,
    required: [true, 'The team all-time stats total seasons league won is required'],
  },
  totalThreePointersAttempted: {
    type: Number,
    required: [true, 'The team all-time stats total three pointers attempted is required'],
  },
  totalSteals: {
    type: Number,
    required: [true, 'The team all-time stats total steals is required'],
  },
  totalThreePointersMade: {
    type: Number,
    required: [true, 'The team all-time stats total three pointers made is required'],
  },
  totalTurnovers: {
    type: Number,
    required: [true, 'The team all-time stats total turnovers is required'],
  },
  createdAt: {
    type: String,
    required: [true, 'The team all-time stats creation date is required'],
  },
  updatedAt: {
    type: String,
    required: [true, 'The team all-time stats update date is required'],
  },
});
