import { Router } from "express";
import { getHealth } from "../controllers/heath.controller";

const router = Router();

router.get("/", getHealth);

export default router;