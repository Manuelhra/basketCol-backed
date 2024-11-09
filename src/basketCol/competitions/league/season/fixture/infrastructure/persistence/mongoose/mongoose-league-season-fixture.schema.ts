import { Schema } from 'mongoose';
import { IMongooseLeagueSeasonFixtureDocument } from './IMongooseLeagueSeasonFixtureDocument';

export const mongooseLeagueSeasonFixtureSchema = new Schema<IMongooseLeagueSeasonFixtureDocument>({
  id: {
    type: String,
    required: [true, "The league season fixture's id is required"],
    unique: true,
  },
  name: {
    type: String,
  },
  date: {
    type: String,
    required: [true, "The league season fixture's date is required"],
  },
  leagueSeasonId: {
    type: String,
    required: [true, "The league season fixture's league season id is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The league season fixture's created at date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The league season fixture's updated at date is required"],
  },
});
