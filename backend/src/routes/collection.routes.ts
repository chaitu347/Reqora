import { Router } from "express";
import { createCollection, getCollectionsByWorkspace } from "../controllers/collection.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, createCollection);
router.get("/workspace/:workspaceId", protect, getCollectionsByWorkspace);

export default router;