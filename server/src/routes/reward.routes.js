// src/routes/reward.routes.js
import express from "express";
import { getRewards, buyReward } from "../controllers/reward.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getRewards);
router.post("/:rewardId/buy", protect, buyReward);

export default router;