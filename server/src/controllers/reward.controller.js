// src/controllers/reward.controller.js
import Reward from "../models/Reward.js";
import User from "../models/User.js";

export const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ active: true });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buyReward = async (req, res) => {
  try {
    const { rewardId } = req.params;

    const reward = await Reward.findById(rewardId);
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    const user = await User.findById(req.user._id);

    if (user.gold < reward.cost) {
      return res.status(400).json({ message: "Not enough gold" });
    }

    user.gold -= reward.cost;

    if (reward.type === "freeTime") {
      if (reward.value === 1) user.inventory.freeTime1h += 1;
      if (reward.value === 2) user.inventory.freeTime2h += 1;
    }

    if (reward.type === "lootBox") {
      user.inventory.lootBoxes += reward.value;
    }

    if (reward.type === "cursedLootBox") {
      user.inventory.cursedLootBoxes += reward.value;
    }

    await user.save();

    res.json({
      message: "Reward purchased successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};