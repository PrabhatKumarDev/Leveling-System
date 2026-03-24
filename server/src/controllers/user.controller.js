// src/controllers/user.controller.js
import User from "../models/User.js";
import Habit from "../models/Habit.js";
import Quest from "../models/Quest.js";
import HabitLog from "../models/HabitLog.js";
import QuestLog from "../models/QuestLog.js";
import dayjs from "dayjs";
import { getPlayerProgression } from "../services/progression.service.js";
import { processHabitPenaltyIfNeeded } from "../services/habitPenalty.service.js";

export const getDashboard = async (req, res) => {
  try {
    await processHabitPenaltyIfNeeded(req.user._id);

    const today = dayjs().format("YYYY-MM-DD");

    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("job");

    const progression = getPlayerProgression(user.totalXp || 0);

    const habits = await Habit.find({
      user: req.user._id,
      isArchived: false,
    });

    const quests = await Quest.find({
      user: req.user._id,
      active: true,
    });

    const todayHabitLogs = await HabitLog.find({
      user: req.user._id,
      date: today,
    });

    const todayQuestLogs = await QuestLog.find({
      user: req.user._id,
      date: today,
    });

    res.json({
      user,
      progression,
      habits,
      quests,
      todayHabitLogs,
      todayQuestLogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const increaseStat = async (req, res) => {
  try {
    const { stat } = req.body;

    const validStats = [
      "strength",
      "discipline",
      "focus",
      "stamina",
      "consistency",
    ];

    if (!validStats.includes(stat)) {
      return res.status(400).json({ message: "Invalid stat" });
    }

    const user = await User.findById(req.user._id);

    if (user.statPoints <= 0) {
      return res.status(400).json({ message: "No stat points available" });
    }

    user.stats[stat] += 1;
    user.statPoints -= 1;

    await user.save();

    res.json({
      message: `${stat} increased`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};