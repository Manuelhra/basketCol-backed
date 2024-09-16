import { Schema } from 'mongoose';

import { IMongooseLeagueFounderUserDocument } from './IMongooseLeagueFounderUserDocument';

export const mongooseLeagueFounderUserSchema = new Schema<IMongooseLeagueFounderUserDocument>({
  id: {
    type: String,
    required: [true, "The league founder user's id is required"],
    unique: true,
  },
  name: {
    firstName: {
      type: String,
      required: [true, "The league founder user's first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "The league founder user's last name is required"],
    },
  },
  email: {
    value: {
      type: String,
      required: [true, "The league founder user's email is required"],
      unique: [true, "The league founder user's email must be unique"],
    },
    verified: { type: Boolean, required: [true, "The league founder user's email verification status is required"] },
  },
  password: {
    type: String,
    required: [true, "The league founder user's password is required"],
  },
  biography: {
    type: String,
    required: [true, "The league founder user's biography is required"],
  },
  type: {
    type: String,
    required: [true, "The league founder user's type is required"],
  },
  active: {
    type: Boolean,
    required: [true, "The league founder user's active status is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The league founder user's creation date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The league founder user's update date is required"],
  },
});
