import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    color: {
      type: String,
      enum: ["violet", "emerald", "rose", "cyan", "amber"],
      default: "violet",
    },

    xpReward: {
      type: Number,
      default: 20,
    },
    goldReward: {
      type: Number,
      default: 10,
    },
    penaltyXp: {
      type: Number,
      default: 8,
    },
    penaltyGold: {
      type: Number,
      default: 4,
    },

    streak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalCompletions: {
      type: Number,
      default: 0,
    },

    lastCompletedDate: {
      type: String,
      default: null,
    },

    primaryStat: {
      type: String,
      enum: ["STR", "VIT", "INT", "FOC", "DIS", "CON", null],
      default: null,
    },
    primaryStatXp: {
      type: Number,
      default: 0,
    },
    secondaryStat: {
      type: String,
      enum: ["STR", "VIT", "INT", "FOC", "DIS", "CON", null],
      default: null,
    },
    secondaryStatXp: {
      type: Number,
      default: 0,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
    lastPenaltyProcessedDate: {
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);