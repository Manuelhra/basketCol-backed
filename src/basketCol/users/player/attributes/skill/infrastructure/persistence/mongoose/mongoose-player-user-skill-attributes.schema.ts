import { Schema } from 'mongoose';
import { IMongoosePlayerUserSkillAttributesDocument } from './IMongoosePlayerUserSkillAttributesDocument';

export const mongoosePlayerUserSkillAttributesSchema = new Schema<IMongoosePlayerUserSkillAttributesDocument>({
  id: {
    type: String,
    required: [true, "The player user skill attributes's id is required"],
    unique: true,
  },
  ballHandle: {
    type: Number,
    required: [true, "The player user skill attributes's ball handle is required"],
  },
  passAccuracy: {
    type: Number,
    required: [true, "The player user skill attributes's pass accuracy is required"],
  },
  speedWithBall: {
    type: Number,
    required: [true, "The player user skill attributes's speed with ball is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The player user skill attributes's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The player user skill attributes's updated at is required"],
  },
  playerUserId: {
    type: String,
    required: [true, "The player user skill attributes's player user id is required"],
  },
});
