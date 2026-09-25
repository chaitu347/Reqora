import { Response } from "express";
import { Request as ApiRequest } from "../models/request.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { name, method, url, headers, body, collectionId } = req.body;

    if (!name || !url || !collectionId) {
      return res.status(400).json({ message: "name, url and collectionId are required" });
    }

    const savedRequest = await ApiRequest.create({
      name,
      method,
      url,
      headers,
      body,
      collectionId,
    });

    res.status(201).json({ request: savedRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to create request", error });
  }
};

export const getRequestsByCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { collectionId } = req.params;

    const requests = await ApiRequest.find({ collectionId });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error });
  }
};

export const updateRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRequest = await ApiRequest.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
    });

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ request: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to update request", error });
  }
};

export const deleteRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await ApiRequest.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request", error });
  }
};