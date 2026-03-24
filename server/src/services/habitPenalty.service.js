import dayjs from "dayjs";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import User from "../models/User.js";
import { applyPenaltyModifiers } from "./bonus.service.js";
import { getPlayerProgression } from "./progression.service.js";

export const processHabitPenaltyIfNeeded = async (userId) => {
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const habits = await Habit.find({
    user: userId,
    isArchived: false,
  });

  if (!habits.length) {
    const user = await User.findById(userId).populate("job");
    return {
      user,
      progression: user ? getPlayerProgression(user.totalXp || 0) : null,
      penaltiesApplied: 0,
    };
  }

  const user = await User.findById(userId).populate("job");
  if (!user) {
    return { user: null, progression: null, penaltiesApplied: 0 };
  }

  let penaltiesApplied = 0;
  let userChanged = false;

  for (const habit of habits) {
    if (habit.lastPenaltyProcessedDate === yesterday) continue;

    const log = await HabitLog.findOne({
      user: userId,
      habit: habit._id,
      date: yesterday,
    });

    if (!log || !log.completed) {
      const penalty = applyPenaltyModifiers({
        baseXpLoss: habit.penaltyXp,
        baseGoldLoss: habit.penaltyGold,
        job: user.job,
      });

      user.totalXp = Math.max(0, (user.totalXp || 0) - penalty.xpLoss);
      user.gold = Math.max(0, (user.gold || 0) - penalty.goldLoss);

      if (habit.streak !== 0) {
        habit.streak = 0;
      }

      penaltiesApplied += 1;
      userChanged = true;
    }

    habit.lastPenaltyProcessedDate = yesterday;
    await habit.save();
  }

  if (userChanged) {
    user.markModified("totalXp");
    user.markModified("gold");
    await user.save();
  }

  const progression = getPlayerProgression(user.totalXp || 0);

  return {
    user,
    progression,
    penaltiesApplied,
  };
};