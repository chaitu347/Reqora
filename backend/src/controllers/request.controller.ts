import { Response } from "express";
import { Request as ApiRequest } from "../models/request.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  isWorkspaceMember,
  workspaceIdForCollection,
  workspaceIdForRequest,
} from "../utils/access";

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { name, method, url, headers, body, collectionId } = req.body;

    if (!name || !url || !collectionId) {
      return res.status(400).json({ message: "name, url and collectionId are required" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const workspaceId = await workspaceIdForCollection(collectionId);
    if (!workspaceId) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const allowed = await isWorkspaceMember(workspaceId, req.userId);
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
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

    if (typeof collectionId !== "string") {
      return res.status(400).json({ message: "Invalid collection id" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const workspaceId = await workspaceIdForCollection(collectionId);
    if (!workspaceId) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const allowed = await isWorkspaceMember(workspaceId, req.userId);
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    const requests = await ApiRequest.find({ collectionId });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error });
  }
};

export const getRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid request id" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const workspaceId = await workspaceIdForRequest(id);
    if (!workspaceId) {
      return res.status(404).json({ message: "Request not found" });
    }

    const allowed = await isWorkspaceMember(workspaceId, req.userId);
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    const foundRequest = await ApiRequest.findById(id);
    if (!foundRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ request: foundRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch request", error });
  }
};

export const updateRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid request id" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const workspaceId = await workspaceIdForRequest(id);
    if (!workspaceId) {
      return res.status(404).json({ message: "Request not found" });
    }

    const allowed = await isWorkspaceMember(workspaceId, req.userId);
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

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

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid request id" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const workspaceId = await workspaceIdForRequest(id);
    if (!workspaceId) {
      return res.status(404).json({ message: "Request not found" });
    }

    const allowed = await isWorkspaceMember(workspaceId, req.userId);
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    const deleted = await ApiRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request", error });
  }
};