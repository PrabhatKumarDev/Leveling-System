// src/routes/habit.routes.js
import express from "express";
import {
  createHabit,
  getHabits,
  completeHabit,
  getHabitHeatmap,
  deleteHabit
} from "../controllers/habit.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createHabit);
router.get("/", getHabits);
router.post("/:habitId/complete", completeHabit);
router.get("/heatmap/all", getHabitHeatmap);
router.delete("/:habitId", deleteHabit);

export default router;