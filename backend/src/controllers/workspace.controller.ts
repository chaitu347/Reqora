import { Response } from "express";
import { Workspace } from "../models/workspace.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const workspace = await Workspace.create({
      name,
      owner: req.userId,
      members: [req.userId],
    });

    res.status(201).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: "Failed to create workspace", error });
  }
};