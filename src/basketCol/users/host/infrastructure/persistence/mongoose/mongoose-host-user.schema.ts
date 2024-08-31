import { Schema } from 'mongoose';

import { IMongooseHostUserDocument } from './IMongooseHostUserDocument';

export const mongooseHostUserSchema = new Schema<IMongooseHostUserDocument>({
  id: {
    type: String,
    required: [true, "The host user's id is required"],
    unique: true,
  },
  name: {
    firstName: {
      type: String,
      required: [true, "The host user's first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "The host user's last name is required"],
    },
  },
  email: {
    value: { type: String, required: [true, "The host user's email is required"] },
    verified: { type: Boolean, required: [true, "The host user's email verification status is required"] },
  },
  password: {
    type: String,
    required: [true, "The host user's password is required"],
  },
  biography: {
    type: String,
    required: [true, "The host user's biography is required"],
  },
  type: {
    type: String,
    required: [true, "The host user's type is required"],
  },
  active: {
    type: Boolean,
    required: [true, "The host user's active status is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The host user's creation date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The host user's update date is required"],
  },
});
