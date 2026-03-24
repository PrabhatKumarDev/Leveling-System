export const getStatXpNeeded = (level) => level * 25;

export const addStatXp = (user, statName, xpToAdd = 0) => {
  if (!user.stats[statName]) {
    return { leveledUp: false, newLevel: null };
  }

  user.stats[statName].xp += xpToAdd;

  let leveledUp = false;

  while (user.stats[statName].xp >= getStatXpNeeded(user.stats[statName].level)) {
    user.stats[statName].xp -= getStatXpNeeded(user.stats[statName].level);
    user.stats[statName].level += 1;
    leveledUp = true;
  }

  return {
    leveledUp,
    newLevel: user.stats[statName].level,
    currentXp: user.stats[statName].xp,
  };
};

export const applyHabitOrQuestStatRewards = (user, entity) => {
  const results = [];

  if (entity.primaryStat && entity.primaryStatXp > 0) {
    const result = addStatXp(user, entity.primaryStat, entity.primaryStatXp);
    results.push({
      stat: entity.primaryStat,
      xpGained: entity.primaryStatXp,
      ...result,
    });
  }

  if (entity.secondaryStat && entity.secondaryStatXp > 0) {
    const result = addStatXp(user, entity.secondaryStat, entity.secondaryStatXp);
    results.push({
      stat: entity.secondaryStat,
      xpGained: entity.secondaryStatXp,
      ...result,
    });
  }

  return results;
};

export const increaseHabitStat = (user, statKey, amount = 1) => {
  if (!statKey) return;

  if (!user.stats) {
    user.stats = {};
  }

  if (!user.stats[statKey]) {
    user.stats[statKey] = { level: 1, xp: 0 };
  }

  const currentLevel = user.stats[statKey].level || 1;
  const currentXp = user.stats[statKey].xp || 0;
  const nextXp = currentXp + amount;
  const neededXp = 4;

  if (nextXp >= neededXp) {
    user.stats[statKey] = {
      level: currentLevel + 1,
      xp: nextXp - neededXp,
    };
  } else {
    user.stats[statKey] = {
      level: currentLevel,
      xp: nextXp,
    };
  }
};