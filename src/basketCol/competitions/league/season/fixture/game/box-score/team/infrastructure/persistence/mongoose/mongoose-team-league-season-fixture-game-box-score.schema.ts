import { Schema } from 'mongoose';

import { IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument } from './IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument';

export const mongooseTeamLeagueSeasonFixtureGameBoxScoreSchema = new Schema<IMongooseTeamLeagueSeasonFixtureGameBoxScoreDocument>({
  id: {
    type: String,
    required: [true, "The team league season fixture game box score's id is required"],
    unique: true,
  },
  points: {
    type: Number,
    required: [true, "The team league season fixture game box score's points are required"],
  },
  assists: {
    type: Number,
    required: [true, "The team league season fixture game box score's assists are required"],
  },
  blocks: {
    type: Number,
    required: [true, "The team league season fixture game box score's blocks are required"],
  },
  defensiveRebounds: {
    type: Number,
    required: [true, "The team league season fixture game box score's defensive rebounds are required"],
  },
  fieldGoalsAttempted: {
    type: Number,
    required: [true, "The team league season fixture game box score's field goals attempted are required"],
  },
  fieldGoalsMade: {
    type: Number,
    required: [true, "The team league season fixture game box score's field goals made are required"],
  },
  fouls: {
    type: Number,
    required: [true, "The team league season fixture game box score's fouls are required"],
  },
  freeThrowsAttempted: {
    type: Number,
    required: [true, "The team league season fixture game box score's free throws attempted are required"],
  },
  freeThrowsMade: {
    type: Number,
    required: [true, "The team league season fixture game box score's free throws made are required"],
  },
  offensiveRebounds: {
    type: Number,
    required: [true, "The team league season fixture game box score's offensive rebounds are required"],
  },
  steals: {
    type: Number,
    required: [true, "The team league season fixture game box score's steals are required"],
  },
  threePointersAttempted: {
    type: Number,
    required: [true, "The team league season fixture game box score's three pointers attempted are required"],
  },
  threePointersMade: {
    type: Number,
    required: [true, "The team league season fixture game box score's three pointers made are required"],
  },
  turnovers: {
    type: Number,
    required: [true, "The team league season fixture game box score's turnovers are required"],
  },
  fixtureGameId: {
    type: String,
    required: [true, "The team league season fixture game box score's fixture game id is required"],
  },
  teamId: {
    type: String,
    required: [true, "The team league season fixture game box score's team id is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The team league season fixture game box score's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The team league season fixture game box score's updated at is required"],
  },
});
