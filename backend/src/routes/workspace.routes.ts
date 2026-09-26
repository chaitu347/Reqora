import { Router } from "express";
import { createWorkspace, getMyWorkspaces } from "../controllers/workspace.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, createWorkspace);
router.get("/mine", protect, getMyWorkspaces);

export default router;