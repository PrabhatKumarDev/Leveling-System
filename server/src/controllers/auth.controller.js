// src/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { getPlayerProgression } from "../services/progression.service.js";
import { processHabitPenaltyIfNeeded } from "../services/habitPenalty.service.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, hunterName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      hunterName: hunterName || "E-Rank Hunter",
    });

    const token = generateToken(user._id);
    const progression = getPlayerProgression(user.totalXp || 0);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        hunterName: user.hunterName,
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        statPoints: user.statPoints,
        stats: user.stats,
      },
      progression
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email }).populate("job");

    if (!foundUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(foundUser._id);

    await processHabitPenaltyIfNeeded(foundUser._id);

    const user = await User.findById(foundUser._id)
      .select("-password")
      .populate("job");

    const progression = getPlayerProgression(user.totalXp || 0);

    res.json({
      token,
      user,
      progression,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  processHabitPenaltyIfNeeded(req.user._id)
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("job");

  const progression = getPlayerProgression(user.totalXp || 0);

  res.json({
    user,
    progression,
  });
};