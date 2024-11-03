import { Schema } from 'mongoose';

import { IMongoosePlayerUserCareerStatsDocument } from './IMongoosePlayerUserCareerStatsDocument';

export const mongoosePlayerUserCareerStatsSchema = new Schema<IMongoosePlayerUserCareerStatsDocument>({
  id: {
    type: String,
    required: [true, "The player user career stats's id is required"],
    unique: true,
  },
  totalGamesPlayed: {
    type: Number,
    required: [true, "The player user career stats's total games played is required"],
  },
  totalGamesWon: {
    type: Number,
    required: [true, "The player user career stats's total games won is required"],
  },
  totalSeasonsLeaguePlayed: {
    type: Number,
    required: [true, "The player user career stats's total seasons league played is required"],
  },
  totalSeasonsLeagueWon: {
    type: Number,
    required: [true, "The player user career stats's total seasons league won is required"],
  },
  totalPoints: {
    type: Number,
    required: [true, "The player user career stats's total points is required"],
  },
  totalOffensiveRebounds: {
    type: Number,
    required: [true, "The player user career stats's total offensive rebounds is required"],
  },
  totalDefensiveRebounds: {
    type: Number,
    required: [true, "The player user career stats's total defensive rebounds is required"],
  },
  totalAssists: {
    type: Number,
    required: [true, "The player user career stats's total assists is required"],
  },
  totalSteals: {
    type: Number,
    required: [true, "The player user career stats's total steals is required"],
  },
  totalBlocks: {
    type: Number,
    required: [true, "The player user career stats's total blocks is required"],
  },
  totalFouls: {
    type: Number,
    required: [true, "The player user career stats's total fouls is required"],
  },
  totalTurnovers: {
    type: Number,
    required: [true, "The player user career stats's total turnovers is required"],
  },
  totalThreePointersAttempted: {
    type: Number,
    required: [true, "The player user career stats's total three pointers attempted is required"],
  },
  totalThreePointersMade: {
    type: Number,
    required: [true, "The player user career stats's total three pointers made is required"],
  },
  totalFreeThrowsAttempted: {
    type: Number,
    required: [true, "The player user career stats's total free throws attempted is required"],
  },
  totalFreeThrowsMade: {
    type: Number,
    required: [true, "The player user career stats's total free throws made is required"],
  },
  totalFieldGoalsAttempted: {
    type: Number,
    required: [true, "The player user career stats's total field goals attempted is required"],
  },
  totalFieldGoalsMade: {
    type: Number,
    required: [true, "The player user career stats's total field goals made is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The player user career stats's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The player user career stats's updated at is required"],
  },
  playerUserId: {
    type: String,
    required: [true, "The player user career stats's player user id is required"],
  },
});
