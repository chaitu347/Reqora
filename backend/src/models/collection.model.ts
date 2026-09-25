import { Schema, model, Document, Types } from "mongoose";

export interface ICollection extends Document {
  name: string;
  workspace: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Collection = model<ICollection>("Collection", collectionSchema);