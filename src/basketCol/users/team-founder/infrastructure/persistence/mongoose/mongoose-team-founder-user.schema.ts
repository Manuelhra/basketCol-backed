import { Schema } from 'mongoose';

import { IMongooseTeamFounderUserDocument } from './IMongooseTeamFounderUserDocument';

export const mongooseTeamFounderUserSchema = new Schema<IMongooseTeamFounderUserDocument>({
  id: {
    type: String,
    required: [true, "The team founder user's id is required"],
    unique: true,
  },
  name: {
    firstName: {
      type: String,
      required: [true, "The team founder user's first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "The team founder user's last name is required"],
    },
  },
  email: {
    value: {
      type: String,
      required: [true, "The team founder user's email is required"],
      unique: [true, "The team founder user's email must be unique"],
    },
    verified: { type: Boolean, required: [true, "The team founder user's email verification status is required"] },
  },
  password: {
    type: String,
    required: [true, "The team founder user's password is required"],
  },
  biography: {
    type: String,
    required: [true, "The team founder user's biography is required"],
  },
  type: {
    type: String,
    required: [true, "The team founder user's type is required"],
  },
  accountStatus: {
    type: String,
    required: [true, "The team founder user's accountStatus status is required"],
  },
  subscriptionType: {
    type: String,
    required: [true, "The team founder user's subscriptionType status is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The team founder user's creation date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The team founder user's update date is required"],
  },
});
