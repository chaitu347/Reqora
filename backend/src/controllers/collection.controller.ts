import { Response } from "express";
import { Collection } from "../models/collection.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { name, workspaceId } = req.body;

    if (!name || !workspaceId) {
      return res.status(400).json({ message: "name and workspaceId are required" });
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

    const collections = await Collection.find({ workspace: workspaceId });

    res.status(200).json({ collections });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch collections", error });
  }
};