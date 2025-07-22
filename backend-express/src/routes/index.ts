import { Router } from "express";
import jobAppTrackerRoutes from "./job-app-tracker";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

router.use("/job-app-tracker", jobAppTrackerRoutes);

export default router;
