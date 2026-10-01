import { Schema, model, Document, Types } from "mongoose";

export interface IRequestVersion extends Document {
  requestId: Types.ObjectId;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  savedBy: Types.ObjectId;
  createdAt: Date;
}

const requestVersionSchema = new Schema<IRequestVersion>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    method: { type: String, required: true },
    url: { type: String, required: true },
    headers: { type: Schema.Types.Mixed, default: {} },
    body: { type: String, default: "" },
    savedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const RequestVersion = model<IRequestVersion>(
  "RequestVersion",
  requestVersionSchema
);