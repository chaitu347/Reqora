import { Router } from "express";
import {
  createRequest,
  getRequestsByCollection,
  updateRequest,
  deleteRequest,
} from "../controllers/request.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, createRequest);
router.get("/collection/:collectionId", protect, getRequestsByCollection);
router.put("/:id", protect, updateRequest);
router.delete("/:id", protect, deleteRequest);

export default router;