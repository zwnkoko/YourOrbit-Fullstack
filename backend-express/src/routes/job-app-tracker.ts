import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  console.log("Job App Tracker Route Hit");
  res.json({ message: "Job App Tracker API is working!" });
});

router.post("/extract-text", (req, res) => {
  console.log(req.body);
  res.json({ message: "To implement OCR" });
});

export default router;
