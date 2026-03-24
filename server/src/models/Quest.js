// src/models/Quest.js
import mongoose from "mongoose";

const questSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["daily", "custom"],
      default: "daily",
    },
    xpReward: {
      type: Number,
      default: 15,
    },
    goldReward: {
      type: Number,
      default: 8,
    },
    penaltyXp: {
      type: Number,
      default: 8,
    },
    penaltyGold: {
      type: Number,
      default: 4,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quest", questSchema);