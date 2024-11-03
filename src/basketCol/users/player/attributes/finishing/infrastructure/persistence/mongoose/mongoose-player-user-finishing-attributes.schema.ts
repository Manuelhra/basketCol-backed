import { Schema } from 'mongoose';

import { IMongoosePlayerUserFinishingAttributesDocument } from './IMongoosePlayerUserFinishingAttributesDocument';

export const mongoosePlayerUserFinishingAttributesSchema = new Schema<IMongoosePlayerUserFinishingAttributesDocument>({
  id: {
    type: String,
    required: [true, "The player user finishing attributes's id is required"],
    unique: true,
  },
  drivingDunk: {
    type: Number,
    required: [true, "The player user finishing attributes's driving dunk is required"],
  },
  drivingLayup: {
    type: Number,
    required: [true, "The player user finishing attributes's driving layup is required"],
  },
  standingDunk: {
    type: Number,
    required: [true, "The player user finishing attributes's standing dunk is required"],
  },
  postControl: {
    type: Number,
    required: [true, "The player user finishing attributes's post control is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The player user finishing attributes's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The player user finishing attributes's updated at is required"],
  },
  playerUserId: {
    type: String,
    required: [true, "The player user finishing attributes's player user id is required"],
  },
});
