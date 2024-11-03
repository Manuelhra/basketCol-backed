import { Schema } from 'mongoose';

import { IMongoosePlayerUserPhysicalAttributesDocument } from './IMongoosePlayerUserPhysicalAttributesDocument';

export const mongoosePlayerUserPhysicalAttributesSchema = new Schema<IMongoosePlayerUserPhysicalAttributesDocument>({
  id: {
    type: String,
    required: [true, "The player user physical attributes's id is required"],
    unique: true,
  },
  acceleration: {
    type: Number,
    required: [true, "The player user physical attributes's acceleration is required"],
  },
  speed: {
    type: Number,
    required: [true, "The player user physical attributes's speed is required"],
  },
  stamina: {
    type: Number,
    required: [true, "The player user physical attributes's stamina is required"],
  },
  strength: {
    type: Number,
    required: [true, "The player user physical attributes's strength is required"],
  },
  vertical: {
    type: Number,
    required: [true, "The player user physical attributes's vertical is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The player user physical attributes's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The player user physical attributes's updated at is required"],
  },
  playerUserId: {
    type: String,
    required: [true, "The player user physical attributes's player user id is required"],
  },
});
