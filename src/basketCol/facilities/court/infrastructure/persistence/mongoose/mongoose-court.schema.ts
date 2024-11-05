import { Schema } from 'mongoose';

import { IMongooseCourtDocument } from './IMongooseCourtDocument';

export const mongooseCourtSchema = new Schema<IMongooseCourtDocument>({
  id: {
    type: String,
    required: [true, "The court's id is required"],
    unique: true,
  },
  surface: {
    type: String,
    required: [true, "The court's surface is required"],
  },
  establishmentDate: {
    type: String,
    required: [true, "The court's establishment date is required"],
  },
  officialName: {
    type: String,
    required: [true, "The court's official name is required"],
  },
  hoopHeight: {
    value: { type: Number, required: [true, "The court's hoop height value is required"] },
    unit: { type: String, required: [true, "The court's hoop height unit is required"] },
  },
  registeredById: {
    type: String,
    required: [true, "The court's registered by id is required"],
  },
  mainImage: {
    url: { type: String, required: [true, "The court's main image url is required"] },
    uploadedAt: { type: String, required: [true, "The court's main image uploaded date is required"] },
    alt: { type: String, required: [true, "The court's main image alt is required"] },
    dimensions: {
      width: { type: Number, required: [true, "The court's main image width is required"] },
      height: { type: Number, required: [true, "The court's main image height is required"] },
    },
  },
  gallery: {
    images: [
      {
        url: { type: String, required: [true, "The court's gallery image url is required"] },
        uploadedAt: { type: String, required: [true, "The court's gallery image uploaded date is required"] },
        alt: { type: String, required: [true, "The court's gallery image alt is required"] },
        dimensions: {
          width: { type: Number, required: [true, "The court's gallery image width is required"] },
          height: { type: Number, required: [true, "The court's gallery image height is required"] },
        },
      },
    ],
  },
  location: {
    country: {
      code: { type: String, required: [true, "The court's country code is required"] },
      label: { type: String, required: [true, "The court's country label is required"] },
    },
    department: {
      code: { type: String, required: [true, "The court's department code is required"] },
      label: { type: String, required: [true, "The court's department label is required"] },
    },
    city: {
      code: { type: String, required: [true, "The court's city code is required"] },
      label: { type: String, required: [true, "The court's city label is required"] },
    },
    coords: {
      lat: { type: Number, required: [true, "The court's latitude is required"] },
      lng: { type: Number, required: [true, "The court's longitude is required"] },
    },
  },
  facilityId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: String,
    required: [true, "The court's creation date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The court's update date is required"],
  },
});
