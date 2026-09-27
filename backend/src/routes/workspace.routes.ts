import { Router } from "express";
import {
  createWorkspace,
  getMyWorkspaces,
  inviteMember,
  getWorkspaceMembers,
} from "../controllers/workspace.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, createWorkspace);
router.get("/mine", protect, getMyWorkspaces);
router.post("/:id/invite", protect, inviteMember);
router.get("/:id/members", protect, getWorkspaceMembers);

export default router;