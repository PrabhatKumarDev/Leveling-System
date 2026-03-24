export const applyRewardModifiers = ({
  baseXp,
  baseGold,
  type,
  job,
}) => {
  let xp = baseXp;
  let gold = baseGold;

  const mods = job?.modifiers || {};

  if (type === "habit") {
    xp += Math.floor((baseXp * (mods.habitXpBonusPct || 0)) / 100);
  }

  if (type === "quest") {
    xp += Math.floor((baseXp * (mods.questXpBonusPct || 0)) / 100);
  }

  if (mods.goldBonusPct) {
    gold += Math.floor((baseGold * mods.goldBonusPct) / 100);
  }

  return { xp, gold };
};

export const applyPenaltyModifiers = ({ baseXpLoss, baseGoldLoss, job }) => {
  const mods = job?.modifiers || {};
  const reduction = mods.penaltyReductionPct || 0;

  const xpLoss = Math.max(
    0,
    Math.floor(baseXpLoss - (baseXpLoss * reduction) / 100)
  );

  const goldLoss = Math.max(
    0,
    Math.floor(baseGoldLoss - (baseGoldLoss * reduction) / 100)
  );

  return { xpLoss, goldLoss };
};