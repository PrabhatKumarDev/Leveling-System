import mongoose from "mongoose";

const modifierSchema = new mongoose.Schema(
  {
    habitXpBonusPct: { type: Number, default: 0 },
    questXpBonusPct: { type: Number, default: 0 },
    goldBonusPct: { type: Number, default: 0 },
    penaltyReductionPct: { type: Number, default: 0 },
    streakBonusPct: { type: Number, default: 0 },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    unlockLevel: {
      type: Number,
      default: 25,
    },
    modifiers: {
      type: modifierSchema,
      default: () => ({}),
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);