// src/models/HabitLog.js
import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
    date: {
      type: String,
      required: true, // YYYY-MM-DD
    },
    primaryStat: {
      type: String,
      enum: ["strength", "vitality", "intellect", "focus", "discipline", "consistency"],
      default: "discipline",
    },
    primaryStatXp: {
      type: Number,
      default: 10,
    },
    secondaryStat: {
      type: String,
      enum: ["strength", "vitality", "intellect", "focus", "discipline", "consistency", null],
      default: null,
    },
    secondaryStatXp: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    xpAwarded: {
      type: Number,
      default: 0,
    },
    goldAwarded: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

habitLogSchema.index({ user: 1, habit: 1, date: 1 }, { unique: true });

export default mongoose.model("HabitLog", habitLogSchema);