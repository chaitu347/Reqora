import mongoose from "mongoose";
import { Workspace } from "../models/workspace.model";
import { Collection } from "../models/collection.model";
import { Request as ApiRequest } from "../models/request.model";

export const isWorkspaceMember = async (
  workspaceId: string,
  userId: string
): Promise<boolean> => {
  if (!mongoose.isValidObjectId(workspaceId)) return false;
  const found = await Workspace.exists({ _id: workspaceId, members: userId });
  return found !== null;
};

export const workspaceIdForCollection = async (
  collectionId: string
): Promise<string | null> => {
  if (!mongoose.isValidObjectId(collectionId)) return null;
  const collection = await Collection.findById(collectionId).select("workspace");
  return collection ? collection.workspace.toString() : null;
};

export const workspaceIdForRequest = async (
  requestId: string
): Promise<string | null> => {
  if (!mongoose.isValidObjectId(requestId)) return null;
  const savedRequest = await ApiRequest.findById(requestId).select("collectionId");
  if (!savedRequest) return null;
  return workspaceIdForCollection(savedRequest.collectionId.toString());
};