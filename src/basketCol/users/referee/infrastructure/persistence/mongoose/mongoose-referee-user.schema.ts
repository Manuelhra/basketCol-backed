import { Schema } from 'mongoose';

import { IMongooseRefereeUserDocument } from './IMongooseRefereeUserDocument';

export const mongooseRefereeUserSchema = new Schema<IMongooseRefereeUserDocument>({
  id: {
    type: String,
    required: [true, "The referee user's id is required"],
    unique: true,
  },
  name: {
    firstName: {
      type: String,
      required: [true, "The referee user's first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "The referee user's last name is required"],
    },
  },
  email: {
    value: {
      type: String,
      required: [true, "The referee user's email is required"],
      unique: [true, "The referee user's email must be unique"],
    },
    verified: { type: Boolean, required: [true, "The referee user's email verification status is required"] },
  },
  password: {
    type: String,
    required: [true, "The referee user's password is required"],
  },
  gender: {
    type: String,
    required: [true, "The referee user's gender is required"],
  },
  biography: {
    type: String,
    required: [true, "The referee user's biography is required"],
  },
  type: {
    type: String,
    required: [true, "The referee user's type is required"],
  },
  accountStatus: {
    type: String,
    required: [true, "The referee user's accountStatus status is required"],
  },
  subscriptionType: {
    type: String,
    required: [true, "The referee user's subscriptionType status is required"],
  },
  profileImage: {
    url: { type: String, required: [true, "The referee user's profile image url is required"] },
    uploadedAt: { type: String, required: [true, "The referee user's profile image uploaded date is required"] },
    alt: { type: String, required: [true, "The referee user's profile image alt is required"] },
    dimensions: {
      width: { type: Number, required: [true, "The referee user's profile image width is required"] },
      height: { type: Number, required: [true, "The referee user's profile image height is required"] },
    },
  },
  createdAt: {
    type: String,
    required: [true, "The referee user's creation date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The referee user's update date is required"],
  },
});
