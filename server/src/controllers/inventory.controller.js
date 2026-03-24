import User from "../models/User.js";

export const getInventory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      inventory: user.inventory || [],
      activeRewardTimer: user.activeRewardTimer || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const useInventoryItem = async (req, res) => {
  try {
    const { rewardId } = req.params;

    const user = await User.findById(req.user._id);

    const item = user.inventory.find(
      (entry) => String(entry.rewardId) === String(rewardId) && entry.quantity > 0
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in inventory" });
    }

    if (
      ["time_reward", "xp_boost", "gold_boost"].includes(item.type)
    ) {
      const now = new Date();
      const endsAt = new Date(now.getTime() + item.durationMinutes * 60 * 1000);

      user.activeRewardTimer = {
        name: item.name,
        type: item.type,
        startedAt: now,
        endsAt,
      };
    }

    item.quantity -= 1;

    user.inventory = user.inventory.filter((entry) => entry.quantity > 0);
    user.markModified("inventory");
    user.markModified("activeRewardTimer");

    await user.save();

    res.json({
      message: `${item.name} activated`,
      inventory: user.inventory,
      activeRewardTimer: user.activeRewardTimer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearExpiredActiveReward = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (
      user.activeRewardTimer?.endsAt &&
      new Date(user.activeRewardTimer.endsAt) <= new Date()
    ) {
      user.activeRewardTimer = {
        name: null,
        type: null,
        startedAt: null,
        endsAt: null,
      };

      user.markModified("activeRewardTimer");
      await user.save();
    }

    res.json({
      activeRewardTimer: user.activeRewardTimer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};