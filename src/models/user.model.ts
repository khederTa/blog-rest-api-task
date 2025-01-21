import mongoose, { Model } from "mongoose";
import { User } from "../types/user";

const userSchema = new mongoose.Schema<User, Model<User>>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" }, 
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    // We can also add the following attributes to our scheme in case we work on real example :)
    //
    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // resetPasswordToken: String,
    // resetPasswordExpiresAt: Date,
    // verificationToken: String,
    // verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<User>("User", userSchema);
