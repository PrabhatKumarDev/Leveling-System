import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getAvailableJobs, chooseJob } from "../controllers/job.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getAvailableJobs);
router.post("/:jobId/choose", chooseJob);

export default router;