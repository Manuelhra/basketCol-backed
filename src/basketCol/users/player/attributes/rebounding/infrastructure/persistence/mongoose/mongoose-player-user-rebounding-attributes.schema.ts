import { Schema } from 'mongoose';

import { IMongoosePlayerUserReboundingAttributesDocument } from './IMongoosePlayerUserReboundingAttributesDocument';

export const mongoosePlayerUserReboundingAttributesSchema = new Schema<IMongoosePlayerUserReboundingAttributesDocument>({
  id: {
    type: String,
    required: [true, "The player user rebounding attributes's id is required"],
    unique: true,
  },
  offensiveRebound: {
    type: Number,
    required: [true, "The player user rebounding attributes's offensive rebound is required"],
  },
  defensiveRebound: {
    type: Number,
    required: [true, "The player user rebounding attributes's defensive rebound is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The player user rebounding attributes's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The player user rebounding attributes's updated at is required"],
  },
  playerUserId: {
    type: String,
    required: [true, "The player user rebounding attributes's player user id is required"],
  },
});
