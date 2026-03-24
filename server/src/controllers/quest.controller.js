// src/controllers/quest.controller.js
import dayjs from "dayjs";
import Quest from "../models/Quest.js";
import QuestLog from "../models/QuestLog.js";
import User from "../models/User.js";
import { addXpAndGold } from "../services/xp.service.js";
import { applyHabitOrQuestStatRewards } from "../services/stat.service.js";

export const createQuest = async (req, res) => {
  try {
    const quest = await Quest.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json(quest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuests = async (req, res) => {
  try {
    const quests = await Quest.find({ user: req.user._id, active: true }).sort({ createdAt: -1 });
    res.json(quests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeQuest = async (req, res) => {
  try {
    const { questId } = req.params;
    const date = req.body.date || dayjs().format("YYYY-MM-DD");

    const quest = await Quest.findOne({ _id: questId, user: req.user._id });
    if (!quest) return res.status(404).json({ message: "Quest not found" });

    let log = await QuestLog.findOne({
      user: req.user._id,
      quest: questId,
      date,
    });

    if (log?.completed) {
      return res.status(400).json({ message: "Quest already completed today" });
    }

    if (!log) {
      log = await QuestLog.create({
        user: req.user._id,
        quest: questId,
        date,
        completed: true,
        xpAwarded: quest.xpReward,
        goldAwarded: quest.goldReward,
      });
    } else {
      log.completed = true;
      log.xpAwarded = quest.xpReward;
      log.goldAwarded = quest.goldReward;
      await log.save();
    }

    const user = await User.findById(req.user._id);
    user.totalQuestsCompleted += 1;

    const xpResult = addXpAndGold(user, quest.xpReward, quest.goldReward);
    const statResult = applyHabitOrQuestStatRewards(user, habit);
    await user.save();

    res.json({
      message: "Quest completed",
      quest,
      log,
      user,
      progression: xpResult.progression,
      leveledUp: xpResult.leveledUp,
      levelsGained: xpResult.levelsGained,
      statResult
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};