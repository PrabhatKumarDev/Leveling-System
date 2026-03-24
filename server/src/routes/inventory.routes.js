import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getInventory,
  useInventoryItem,
  clearExpiredActiveReward,
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getInventory);
router.post("/:rewardId/use", useInventoryItem);
router.post("/active/cleanup", clearExpiredActiveReward);

export default router;