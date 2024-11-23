import { Schema } from 'mongoose';

import { IMongooseTeamDocument } from './IMongooseTeamDocument';

export const mongooseTeamSchema = new Schema<IMongooseTeamDocument>({
  id: {
    type: String,
    required: [true, "The team's id is required"],
    unique: true,
  },
  officialName: {
    type: String,
    required: [true, "The team's official name is required"],
  },
  gender: {
    type: String,
    required: [true, "The team's gender is required"],
  },
  logo: {
    url: { type: String, required: [true, "The team's logo url is required"] },
    uploadedAt: { type: String, required: [true, "The team's logo uploaded date is required"] },
    alt: { type: String, required: [true, "The team's logo alt is required"] },
    dimensions: {
      width: { type: Number, required: [true, "The team's logo width is required"] },
      height: { type: Number, required: [true, "The team's logo height is required"] },
    },
  },
  mainImage: {
    url: { type: String, required: [true, "The team's main image url is required"] },
    uploadedAt: { type: String, required: [true, "The team's main image uploaded date is required"] },
    alt: { type: String, required: [true, "The team's main image alt is required"] },
    dimensions: {
      width: { type: Number, required: [true, "The team's main image width is required"] },
      height: { type: Number, required: [true, "The team's main image height is required"] },
    },
  },
  gallery: {
    images: [
      {
        url: { type: String, required: [true, "The team's gallery image url is required"] },
        uploadedAt: { type: String, required: [true, "The team's gallery image uploaded date is required"] },
        alt: { type: String, required: [true, "The team's gallery image alt is required"] },
        dimensions: {
          width: { type: Number, required: [true, "The team's gallery image width is required"] },
          height: { type: Number, required: [true, "The team's gallery image height is required"] },
        },
      },
    ],
  },
  teamFounderUserId: {
    type: String,
    required: [true, "The team's founder user id is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The team's created at date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The team's updated at date is required"],
  },
});
