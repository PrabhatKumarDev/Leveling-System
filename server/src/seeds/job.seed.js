import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Job from "../models/Job.js";

const jobs = [
  {
    name: "Assassin",
    description: "A swift hunter who grows through precision and consistency.",
    unlockLevel: 25,
    modifiers: {
      habitXpBonusPct: 20,
      goldBonusPct: 10,
      streakBonusPct: 10,
    },
  },
  {
    name: "Tank",
    description: "A resilient hunter who endures punishment and never breaks.",
    unlockLevel: 25,
    modifiers: {
      penaltyReductionPct: 50,
      goldBonusPct: 5,
    },
  },
  {
    name: "Mage",
    description: "A scaling class that gains greater power from quest completion.",
    unlockLevel: 25,
    modifiers: {
      questXpBonusPct: 25,
      goldBonusPct: 10,
    },
  },
  {
    name: "Monarch Candidate",
    description: "A rare path with balanced growth, wealth, and penalty resistance.",
    unlockLevel: 25,
    modifiers: {
      habitXpBonusPct: 15,
      questXpBonusPct: 15,
      goldBonusPct: 15,
      penaltyReductionPct: 15,
    },
  },
];

const seedJobs = async () => {
  try {
    await connectDB();

    await Job.deleteMany({});
    await Job.insertMany(jobs);

    console.log("Jobs seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Job seed error:", error);
    process.exit(1);
  }
};

seedJobs();