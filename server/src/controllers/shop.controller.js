import Reward from "../models/Reward.js";
import User from "../models/User.js";

export const getShopRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({
      active: true,
      $or: [{ isCustom: false }, { createdBy: req.user._id }],
    }).sort({ cost: 1 });

    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buyReward = async (req, res) => {
  try {
    const { rewardId } = req.params;

    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    const user = await User.findById(req.user._id);

    if (!user.inventory) user.inventory = [];
    if (!user.activeRewardTimer) {
      user.activeRewardTimer = {
        name: null,
        type: null,
        startedAt: null,
        endsAt: null,
      };
    }

    if (user.gold < reward.cost) {
      return res.status(400).json({ message: "Not enough gold" });
    }

    user.gold -= reward.cost;

    const existing = user.inventory.find(
      (item) => String(item.rewardId) === String(reward._id)
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      user.inventory.push({
        rewardId: reward._id,
        name: reward.name,
        type: reward.type,
        quantity: 1,
        durationMinutes: reward.durationMinutes || 0,
      });
    }

    user.markModified("inventory");
    await user.save();

    res.json({
      message: "Reward purchased successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomReward = async (req, res) => {
  try {
    const { name, cost, type, durationMinutes = 0 } = req.body;

    if (!name || !cost || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const reward = await Reward.create({
      name,
      key: `custom_${req.user._id}_${Date.now()}`,
      type,
      cost,
      durationMinutes: type === "time_reward" ? durationMinutes : 0,
      isCustom: true,
      createdBy: req.user._id,
    });

    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};