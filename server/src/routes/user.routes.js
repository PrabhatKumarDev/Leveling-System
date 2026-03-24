// src/routes/user.routes.js
import express from "express";
import { getDashboard } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { increaseStat } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboard);
router.post("/stats/increase", protect, increaseStat);

export default router;