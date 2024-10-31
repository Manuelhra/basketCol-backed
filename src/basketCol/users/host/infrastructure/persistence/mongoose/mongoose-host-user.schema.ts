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
    value: {
      type: String,
      required: [true, "The host user's email is required"],
      unique: [true, "The host user's email must be unique"],
    },
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
  accountStatus: {
    type: String,
    required: [true, "The host user's accountStatus status is required"],
  },
  subscriptionType: {
    type: String,
    required: [true, "The host user's subscriptionType status is required"],
  },
  profileImage: {
    url: { type: String, required: [true, "The host user's profile image url is required"] },
    updatedAt: { type: String, required: [true, "The host user's profile image update date is required"] },
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
