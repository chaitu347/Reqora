import { Response } from "express";
import { Collection } from "../models/collection.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { isWorkspaceMember } from "../utils/access";

export const createCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { name, workspaceId } = req.body;

    if (!name || !workspaceId) {
      return res.status(400).json({ message: "name and workspaceId are required" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const allowed = await isWorkspaceMember(workspaceId, req.userId);
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    const collection = await Collection.create({
      name,
      workspace: workspaceId,
    });

    res.status(201).json({ collection });
  } catch (error) {
    res.status(500).json({ message: "Failed to create collection", error });
  }
};

export const getCollectionsByWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const { workspaceId } = req.params;
  

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

   if (typeof workspaceId!== "string") {
      return res.status(400).json({ message: "Invalid workspace id" });
    }

    const allowed = await isWorkspaceMember(workspaceId, req.userId);
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    const collections = await Collection.find({ workspace: workspaceId });

    res.status(200).json({ collections });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch collections", error });
  }
};