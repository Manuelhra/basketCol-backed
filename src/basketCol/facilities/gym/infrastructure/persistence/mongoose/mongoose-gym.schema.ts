import { Schema } from 'mongoose';

import { IMongooseGymDocument } from './IMongooseGymDocument';

export const mongooseGymSchema = new Schema<IMongooseGymDocument>({
  id: {
    type: String,
    required: [true, "The gym's id is required"],
    unique: true,
  },
  establishmentDate: {
    type: String,
    required: [true, "The gym's establishment date is required"],
  },
  officialName: {
    type: String,
    required: [true, "The gym's official name is required"],
  },
  registeredById: {
    type: String,
    required: [true, "The gym's registered by id is required"],
  },
  mainImage: {
    url: { type: String, required: [true, "The gym's main image url is required"] },
    uploadedAt: { type: String, required: [true, "The gym's main image uploaded date is required"] },
    alt: { type: String, required: [true, "The gym's main image alt is required"] },
    dimensions: {
      width: { type: Number, required: [true, "The gym's main image width is required"] },
      height: { type: Number, required: [true, "The gym's main image height is required"] },
    },
  },
  gallery: {
    images: [
      {
        url: { type: String, required: [true, "The gym's gallery image url is required"] },
        uploadedAt: { type: String, required: [true, "The gym's gallery image uploaded date is required"] },
        alt: { type: String, required: [true, "The gym's gallery image alt is required"] },
        dimensions: {
          width: { type: Number, required: [true, "The gym's gallery image width is required"] },
          height: { type: Number, required: [true, "The gym's gallery image height is required"] },
        },
      },
    ],
  },
  location: {
    country: {
      code: { type: String, required: [true, "The gym's country code is required"] },
      label: { type: String, required: [true, "The gym's country label is required"] },
    },
    department: {
      code: { type: String, required: [true, "The gym's department code is required"] },
      label: { type: String, required: [true, "The gym's department label is required"] },
    },
    city: {
      code: { type: String, required: [true, "The gym's city code is required"] },
      label: { type: String, required: [true, "The gym's city label is required"] },
    },
    coords: {
      lat: { type: Number, required: [true, "The gym's latitude is required"] },
      lng: { type: Number, required: [true, "The gym's longitude is required"] },
    },
  },
  createdAt: {
    type: String,
    required: [true, "The gym's creation date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The gym's update date is required"],
  },
});
