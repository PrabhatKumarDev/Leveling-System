// src/services/xp.service.js
import { getPlayerProgression } from "./progression.service.js";

export const addXpAndGold = (user, xpToAdd = 0, goldToAdd = 0) => {
  const oldProgress = getPlayerProgression(user.totalXp || 0);

  user.totalXp = Math.max(0, (user.totalXp || 0) + xpToAdd);
  user.gold = Math.max(0, (user.gold || 0) + goldToAdd);

  const newProgress = getPlayerProgression(user.totalXp);

  const levelsGained = newProgress.level - oldProgress.level;

  if (levelsGained > 0) {
    user.statPoints = (user.statPoints || 0) + levelsGained * 3;
  }

  user.level = newProgress.level;

  return {
    user,
    leveledUp: levelsGained > 0,
    levelsGained,
    progression: newProgress,
  };
};

export const applyPenalty = (user, xpLoss = 0, goldLoss = 0) => {
  const oldProgress = getPlayerProgression(user.totalXp || 0);

  user.totalXp = Math.max(0, (user.totalXp || 0) - xpLoss);
  user.gold = Math.max(0, (user.gold || 0) - goldLoss);

  const newProgress = getPlayerProgression(user.totalXp);

  user.level = newProgress.level;

  return {
    user,
    rankDropped: newProgress.rank !== oldProgress.rank,
    levelDropped: newProgress.level !== oldProgress.level,
    progression: newProgress,
  };
};