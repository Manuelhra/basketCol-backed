import { Schema } from 'mongoose';

import { IMongooseLeagueSeasonAwardsDocument } from './IMongooseLeagueSeasonAwardsDocument';

export const mongooseLeagueSeasonAwardsSchema = new Schema<IMongooseLeagueSeasonAwardsDocument>({
  id: {
    type: String,
    required: [true, "The league season awards's id is required"],
    unique: true,
  },
  bestAssistProviderId: {
    type: String,
    required: [true, "The league season awards's best assist provider id is required"],
  },
  bestDefensiveRebounderId: {
    type: String,
    required: [true, "The league season awards's best defensive rebounder id is required"],
  },
  bestFreeThrowShooterId: {
    type: String,
    required: [true, "The league season awards's best free throw shooter id is required"],
  },
  bestOffensiveRebounderId: {
    type: String,
    required: [true, "The league season awards's best offensive rebounder id is required"],
  },
  bestThreePointShooterId: {
    type: String,
    required: [true, "The league season awards's best three point shooter id is required"],
  },
  bestTwoPointShooterId: {
    type: String,
    required: [true, "The league season awards's best two point shooter id is required"],
  },
  mostValuablePlayerId: {
    type: String,
    required: [true, "The league season awards's most valuable player id is required"],
  },
  championTeamId: {
    type: String,
    required: [true, "The league season awards's champion team id is required"],
  },
  leagueSeasonId: {
    type: String,
    required: [true, "The league season awards's league season id is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The league season awards's created at date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The league season awards's updated at date is required"],
  },
});
