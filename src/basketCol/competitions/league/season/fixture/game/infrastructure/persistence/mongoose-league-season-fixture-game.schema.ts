import { Schema } from 'mongoose';

import { IMongooseLeagueSeasonFixtureGameDocument } from './IMongooseLeagueSeasonFixtureGameDocument';

export const mongooseLeagueSeasonFixtureGameSchema = new Schema<IMongooseLeagueSeasonFixtureGameDocument>({
  id: {
    type: String,
    required: [true, "The league season fixture game's id is required"],
    unique: true,
  },
  startTime: {
    type: String,
    required: [true, "The league season fixture game's start time is required"],
  },
  endTime: {
    type: String,
  },
  homeTeamId: {
    type: String,
    required: [true, "The league season fixture game's home team id is required"],
  },
  awayTeamId: {
    type: String,
    required: [true, "The league season fixture game's away team id is required"],
  },
  homeScore: {
    type: Number,
    required: [true, "The league season fixture game's home score is required"],
  },
  awayScore: {
    type: Number,
    required: [true, "The league season fixture game's away score is required"],
  },
  quarter: {
    type: Number,
  },
  overtime: {
    type: Boolean,
    required: [true, "The league season fixture game's overtime is required"],
  },
  overtimeNumber: {
    type: Number,
  },
  gameDuration: {
    value: { type: Number, required: [true, "The league season fixture game's game duration value is required"] },
    unit: { type: String, required: [true, "The league season fixture game's game duration unit is required"] },
  },
  gameType: {
    type: String,
    required: [true, "The league season fixture game's game type is required"],
  },
  gameStatus: {
    type: String,
    required: [true, "The league season fixture game's game status is required"],
  },
  headRefereeId: {
    type: String,
    required: [true, "The league season fixture game's head referee id is required"],
  },
  assistantRefereeId: {
    type: String,
    required: [true, "The league season fixture game's assistant referee id is required"],
  },
  courtId: {
    type: String,
    required: [true, "The league season fixture game's court id is required"],
  },
  fixtureId: {
    type: String,
    required: [true, "The league season fixture game's fixture id is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The league season fixture game's created at date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The league season fixture game's updated at date is required"],
  },
});
