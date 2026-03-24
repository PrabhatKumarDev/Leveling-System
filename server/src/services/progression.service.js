// src/services/progression.service.js
import { LEVELS, RANKS } from "../config/progression.js";

export const getLevelData = (totalXp) => {
  let currentLevel = LEVELS[0];

  for (const lvl of LEVELS) {
    if (totalXp >= lvl.minXp) {
      currentLevel = lvl;
    } else {
      break;
    }
  }

  const currentIndex = LEVELS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = LEVELS[currentIndex + 1] || null;

  const currentLevelMinXp = currentLevel.minXp;
  const nextLevelMinXp = nextLevel ? nextLevel.minXp : currentLevel.minXp;

  const xpIntoLevel = totalXp - currentLevelMinXp;
  const xpNeededForNextLevel = nextLevel
    ? nextLevelMinXp - currentLevelMinXp
    : 0;

  return {
    level: currentLevel.level,
    levelTitle: currentLevel.title,
    currentLevelMinXp,
    nextLevelMinXp: nextLevel ? nextLevel.minXp : null,
    xpIntoLevel,
    xpNeededForNextLevel,
    isMaxLevel: !nextLevel,
  };
};

export const getRankData = (totalXp) => {
  for (const rank of RANKS) {
    if (totalXp >= rank.minXp) {
      return rank;
    }
  }

  return RANKS[RANKS.length - 1];
};

export const getPlayerProgression = (totalXp) => {
  const levelData = getLevelData(totalXp);
  const rankData = getRankData(totalXp);

  return {
    totalXp,
    level: levelData.level,
    levelTitle: levelData.levelTitle,
    rank: rankData.rank,
    stars: rankData.stars,
    xpIntoLevel: levelData.xpIntoLevel,
    xpNeededForNextLevel: levelData.xpNeededForNextLevel,
    nextLevelMinXp: levelData.nextLevelMinXp,
    isMaxLevel: levelData.isMaxLevel,
  };
};