import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

export default router;
