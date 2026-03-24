// src/routes/quest.routes.js
import express from "express";
import { createQuest, getQuests, completeQuest } from "../controllers/quest.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createQuest);
router.get("/", getQuests);
router.post("/:questId/complete", completeQuest);

export default router;