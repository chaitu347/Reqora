import { Router } from "express";
import { runRequest } from "../controllers/runner.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, runRequest);

export default router;