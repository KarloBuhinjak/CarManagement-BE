import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    walletAddress: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^0x[a-f0-9]{40}$/,
      sparse: true,
    },

    passwordSetupToken: {
      type: String,
      sparse: true,
      index: true,
    },

    passwordSetupExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
