// src/models/QuestLog.js
import mongoose from "mongoose";

const questLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quest",
      required: true,
    },
    date: {
      type: String,
      required: true,
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

questLogSchema.index({ user: 1, quest: 1, date: 1 }, { unique: true });

export default mongoose.model("QuestLog", questLogSchema);