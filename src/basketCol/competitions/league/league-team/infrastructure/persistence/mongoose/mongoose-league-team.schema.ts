import { Schema } from 'mongoose';

import { IMongooseLeagueTeamDocument } from './IMongooseLeagueTeamDocument';

export const mongooseLeagueTeamSchema = new Schema<IMongooseLeagueTeamDocument>({
  id: {
    type: String,
    required: [true, "The league team's id is required"],
    unique: true,
  },
  leagueId: {
    type: String,
    required: [true, "The league team's league id is required"],
  },
  teamId: {
    type: String,
    required: [true, "The league team's team id is required"],
  },
  status: {
    type: String,
    required: [true, "The league team's status is required"],
  },
  joinedAt: {
    type: String,
    required: [true, "The league team's joined at is required"],
  },
  leftAt: {
    type: String,
  },
  divisionLevel: {
    type: String,
  },
  lastPromotionDate: {
    type: String,
  },
  lastRelegationDate: {
    type: String,
  },
  createdAt: {
    type: String,
    required: [true, "The league team's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The league team's updated at is required"],
  },
});
