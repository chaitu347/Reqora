import { Response } from "express";
import { Workspace } from "../models/workspace.model";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { isWorkspaceMember } from "../utils/access";

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

export const getMyWorkspaces = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const workspaces = await Workspace.find({ members: req.userId });
    res.status(200).json({ workspaces });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch workspaces", error });
  }
};

export const inviteMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const workspace = await Workspace.findById(id);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Only the workspace owner can invite members" });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const alreadyMember = workspace.members.some(
      (memberId) => memberId.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    workspace.members.push(userToAdd._id);
    await workspace.save();

    res.status(200).json({ message: "Member added", workspace });
  } catch (error) {
    res.status(500).json({ message: "Failed to invite member", error });
  }
};

export const getWorkspaceMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const allowed = await isWorkspaceMember(id, req.userId);
    if (!allowed) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    const workspace = await Workspace.findById(id).populate("members", "name email");
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ members: workspace.members });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch members", error });
  }
};