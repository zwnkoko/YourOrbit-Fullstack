import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  console.log("Job App Tracker Route Hit");
  res.json({ message: "Job App Tracker API is working!" });
});

export default router;
