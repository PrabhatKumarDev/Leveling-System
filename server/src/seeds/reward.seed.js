import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Reward from "../models/Reward.js";

const rewards = [
  {
    name: "Double XP Boost",
    key: "double_xp_boost_60",
    type: "xp_boost",
    cost: 120,
    durationMinutes: 60,
    multiplier: 2,
  },
  {
    name: "Gold Boost",
    key: "gold_boost_60",
    type: "gold_boost",
    cost: 100,
    durationMinutes: 60,
    multiplier: 1.5,
  },
  {
    name: "1 Hour Free Time",
    key: "free_time_60",
    type: "time_reward",
    cost: 80,
    durationMinutes: 60,
  },
  {
    name: "2 Hour Free Time",
    key: "free_time_120",
    type: "time_reward",
    cost: 140,
    durationMinutes: 120,
  },
  {
    name: "30 Mins Gaming Time",
    key: "gaming_30",
    type: "time_reward",
    cost: 60,
    durationMinutes: 30,
  },
  {
    name: "Movie Night",
    key: "movie_night",
    type: "custom_reward",
    cost: 150,
  },
  {
    name: "Snack Reward",
    key: "snack_reward",
    type: "custom_reward",
    cost: 40,
  },
];

const seed = async () => {
  await connectDB();
  await Reward.deleteMany({ isCustom: false });
  await Reward.insertMany(rewards);
  console.log("Rewards seeded");
  process.exit(0);
};

seed();