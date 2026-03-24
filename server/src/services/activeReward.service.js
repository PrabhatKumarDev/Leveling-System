export const getRewardAdjustedValues = (user, xp, gold) => {
  const timer = user.activeRewardTimer;
  const now = new Date();

  if (!timer?.type || !timer?.endsAt) {
    return { xp, gold };
  }

  if (new Date(timer.endsAt) <= now) {
    return { xp, gold };
  }

  if (timer.type === "xp_boost") {
    return { xp: xp * 2, gold };
  }

  if (timer.type === "gold_boost") {
    return { xp, gold: Math.floor(gold * 1.5) };
  }

  return { xp, gold };
};