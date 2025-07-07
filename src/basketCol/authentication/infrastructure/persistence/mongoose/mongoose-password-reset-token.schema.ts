import { Schema } from 'mongoose';
import { IMongoosePasswordResetTokenDocument } from './IMongoosePasswordResetTokenDocument';

export const mongoosePasswordResetTokenSchema = new Schema<IMongoosePasswordResetTokenDocument>({
  id: {
    type: String,
    required: [true, "The password reset token's id is required"],
    unique: true,
  },
  userId: {
    type: String,
    required: [true, "The password reset token's user id is required"],
  },
  userType: {
    type: String,
    required: [true, "The password reset token's user type is required"],
  },
  code: {
    type: String,
    required: [true, "The password reset token's code is required"],
  },
  expiresAtDate: {
    type: String,
    required: [true, "The password reset token's expiration date is required"],
  },
  expiresAtTime: {
    type: String,
    required: [true, "The password reset token's expiration time is required"],
  },
  isUsed: {
    type: Boolean,
    required: [true, "The password reset token's isUsed status is required"],
  },
  createdAt: {
    type: String,
    required: [true, "The password reset token's created date is required"],
  },
  updatedAt: {
    type: String,
    required: [true, "The password reset token's updated date is required"],
  },
});
