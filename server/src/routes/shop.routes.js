import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getShopRewards,
  buyReward,
  createCustomReward,
} from "../controllers/shop.controller.js";

const router = express.Router();
router.get("/ping", (req, res) => {
  res.json({ message: "shop route works" });
});
router.use(protect);

router.get("/", getShopRewards);
router.post("/custom", createCustomReward);
router.post("/:rewardId/buy", buyReward);

export default router;