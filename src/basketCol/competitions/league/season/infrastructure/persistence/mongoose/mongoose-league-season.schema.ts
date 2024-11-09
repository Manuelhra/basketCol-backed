import { Schema } from 'mongoose';

import { IMongooseLeagueSeasonDocument } from './IMongooseLeagueSeasonDocument';

export const mongooseLeagueSeasonSchema = new Schema<IMongooseLeagueSeasonDocument>({
  id: {
    type: String,
    required: [true, "The league season's id is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "The league season's name is required"],
  },
  status: {
    type: String,
    required: [true, "The league season's status is required"],
  },
  startDate: {
    type: String,
    required: [true, "The league season's start date is required"],
  },
  endDate: {
    type: String,
    required: [true, "The league season's end date is required"],
  },
  courtIdList: {
    type: [String],
    required: [true, "The league season's court id list is required"],
  },
  leagueId: {
    type: String,
    required: [true, "The league season's league id is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The league season's created at date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The league season's updated at date is required"],
  },
});
