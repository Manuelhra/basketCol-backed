import { Schema } from 'mongoose';
import { IMongooseTeamPlayerDocument } from './IMongooseTeamPlayerDocument';

export const mongooseTeamPlayerSchema = new Schema<IMongooseTeamPlayerDocument>({
  id: {
    type: String,
    required: [true, "The team player's id is required"],
    unique: true,
  },
  teamId: {
    type: String,
    required: [true, "The team player's team id is required"],
  },
  playerUserId: {
    type: String,
    required: [true, "The team player's player user id is required"],
  },
  status: {
    type: String,
    required: [true, "The team player's status is required"],
  },
  jerseyNumber: {
    type: Number,
  },
  position: {
    type: String,
    required: [true, "The team player's position is required"],
  },
  joinedAt: {
    type: String,
    required: [true, "The team player's joined at is required"],
  },
  leftAt: {
    type: String,
  },
  createdAt: {
    type: String,
    required: [true, "The team player's created at is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The team player's updated at is required"],
  },
});
