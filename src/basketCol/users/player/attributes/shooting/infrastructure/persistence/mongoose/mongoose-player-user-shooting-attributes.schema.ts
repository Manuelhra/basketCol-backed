import { Schema } from 'mongoose';

import { IMongoosePlayerUserShootingAttributesDocument } from './IMongoosePlayerUserShootingAttributesDocument';

export const mongoosePlayerUserShootingAttributesSchema = new Schema<IMongoosePlayerUserShootingAttributesDocument>({
  id: {
    type: String,
    required: [true, "The player user shooting attributes's id is required"],
  },
  closeShot: {
    type: Number,
    required: [true, "The player user shooting attributes's close shot is required"],
  },
  freeThrow: {
    type: Number,
    required: [true, "The player user shooting attributes's free throw is required"],
  },
  midRangeShot: {
    type: Number,
    required: [true, "The player user shooting attributes's mid range shot is required"],
  },
  threePointShot: {
    type: Number,
    required: [true, "The player user shooting attributes's three point shot is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The player user shooting attributes's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The player user shooting attributes's updated at is required"],
  },
  playerUserId: {
    type: String,
    required: [true, "The player user shooting attributes's player user id is required"],
  },
});
