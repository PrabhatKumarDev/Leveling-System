// src/controllers/habit.controller.js
import dayjs from "dayjs";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import User from "../models/User.js";
import { addXpAndGold } from "../services/xp.service.js";
import { applyRewardModifiers, applyPenaltyModifiers } from "../services/bonus.service.js";
import { increaseHabitStat } from "../services/stat.service.js";
import { getRewardAdjustedValues } from "../services/activeReward.service.js";

export const createHabit = async (req, res) => {
  try {
    const {
      title,
      description,
      color = "violet",
      primaryStat = null,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Habit title is required" });
    }

    const habit = await Habit.create({
      user: req.user._id,
      title: title.trim(),
      description: description?.trim() || "",
      color,

      difficulty: "medium",

      xpReward: 20,
      goldReward: 10,
      penaltyXp: 8,
      penaltyGold: 4,

      primaryStat,
      primaryStatXp: 1,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const date = req.body.date || dayjs().format("YYYY-MM-DD");

    const habit = await Habit.findOne({ _id: habitId, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    let log = await HabitLog.findOne({
      user: req.user._id,
      habit: habitId,
      date,
    });

    if (log?.completed) {
      return res
        .status(400)
        .json({ message: "Habit already completed for this date" });
    }

    const user = await User.findById(req.user._id).populate("job");

    const reward = applyRewardModifiers({
      baseXp: habit.xpReward,
      baseGold: habit.goldReward,
      type: "habit",
      job: user.job,
    });

    const adjusted = getRewardAdjustedValues(user, reward.xp, reward.gold);

    if (!log) {
      log = await HabitLog.create({
        user: req.user._id,
        habit: habitId,
        date,
        completed: true,
        xpAwarded: adjusted.xp,
        goldAwarded: adjusted.gold,
      });
    } else {
      log.completed = true;
      log.xpAwarded = adjusted.xp;
      log.goldAwarded = adjusted.gold;
      await log.save();
    }

    habit.streak += 1;
    if (habit.streak > habit.longestStreak) {
      habit.longestStreak = habit.streak;
    }

    habit.lastCompletedDate = date;
    habit.totalCompletions = (habit.totalCompletions || 0) + 1;

    user.totalHabitsCompleted += 1;

    const xpResult = addXpAndGold(user, reward.xp, reward.gold);

    if (habit.primaryStat) {
      increaseHabitStat(user, habit.primaryStat, habit.primaryStatXp || 1);
      user.markModified("stats");
    }
    console.log("habit.primaryStat:", habit.primaryStat);
    console.log("before stat update:", user.stats);

    console.log("after stat update:", user.stats);

    await habit.save();
    await user.save();

    res.json({
      message: "Habit completed",
      log,
      habit,
      user,
      progression: xpResult.progression,
      leveledUp: xpResult.leveledUp,
      levelsGained: xpResult.levelsGained,
      appliedJob: user.job || null,
      reward,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHabitHeatmap = async (req, res) => {
  try {
    const logs = await HabitLog.find({
      user: req.user._id,
      completed: true,
    }).select("habit date completed");

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;

    const habit = await Habit.findOneAndDelete({
      _id: habitId,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await HabitLog.deleteMany({
      user: req.user._id,
      habit: habitId,
    });

    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};