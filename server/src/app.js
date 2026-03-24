// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import habitRoutes from "./routes/habit.routes.js";
import questRoutes from "./routes/quest.routes.js";
import rewardRoutes from "./routes/reward.routes.js";
import jobRoutes from "./routes/job.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://leveling-system-roan.vercel.app/",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);



app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("System Tracker API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/inventory", inventoryRoutes);

export default app;