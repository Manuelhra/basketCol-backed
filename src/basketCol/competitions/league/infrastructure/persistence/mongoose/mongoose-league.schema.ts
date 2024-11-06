import { Schema } from 'mongoose';

import { IMongooseLeagueDocument } from './IMongooseLeagueDocument';

export const mongooseLeagueSchema = new Schema<IMongooseLeagueDocument>({
  id: {
    type: String,
    required: [true, "The league's id is required"],
    unique: true,
  },
  name: {
    short: {
      type: String,
      required: [true, "The league's short name is required"],
    },
    official: {
      type: String,
      required: [true, "The league's official name is required"],
    },
  },
  description: {
    short: {
      type: String,
      required: [true, "The league's short description is required"],
    },
    complete: {
      type: String,
      required: [true, "The league's complete description is required"],
    },
  },
  rules: {
    type: String,
    required: [true, "The league's rules are required"],
  },
  level: {
    type: String,
    required: [true, "The league's level is required"],
  },
  location: {
    country: {
      code: {
        type: String,
        required: [true, "The league's country code is required"],
      },
      label: {
        type: String,
        required: [true, "The league's country label is required"],
      },
    },
    department: {
      code: {
        type: String,
        required: [true, "The league's department code is required"],
      },
      label: {
        type: String,
        required: [true, "The league's department label is required"],
      },
    },
    city: {
      code: {
        type: String,
        required: [true, "The league's city code is required"],
      },
      label: {
        type: String,
        required: [true, "The league's city label is required"],
      },
    },
    coords: {
      lat: { type: Number, required: [true, "The league's latitude is required"] },
      lng: { type: Number, required: [true, "The league's longitude is required"] },
    },
  },
  establishmentDate: {
    type: String,
    required: [true, "The league's establishment date is required"],
  },
  leagueFounderUserId: {
    type: String,
    required: [true, "The league's founder user id is required"],
  },
  isActive: {
    type: Boolean,
    required: [true, "The league's active status is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The league's creation date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The league's update date is required"],
  },
});
