import { Schema } from 'mongoose';

import { IMongoosePlayerUserDefensiveAttributesDocument } from './IMongoosePlayerUserDefensiveAttributesDocument';

export const mongoosePlayerUserDefensiveAttributesSchema = new Schema<IMongoosePlayerUserDefensiveAttributesDocument>({
  id: {
    type: String,
    required: [true, "The player user defensive attributes's id is required"],
    unique: true,
  },
  interiorDefense: {
    type: Number,
    required: [true, "The player user defensive attributes's interior defense is required"],
  },
  perimeterDefense: {
    type: Number,
    required: [true, "The player user defensive attributes's perimeter defense is required"],
  },
  block: {
    type: Number,
    required: [true, "The player user defensive attributes's block is required"],
  },
  steal: {
    type: Number,
    required: [true, "The player user defensive attributes's steal is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The player user defensive attributes's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The player user defensive attributes's updated at is required"],
  },
  playerUserId: {
    type: String,
    required: [true, "The player user defensive attributes's player user id is required"],
  },
});
