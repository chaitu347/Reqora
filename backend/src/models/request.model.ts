import { Schema, model, Document, Types } from "mongoose";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface IRequest extends Document {
  name: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body: string;
  collectionId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const requestSchema = new Schema<IRequest>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      default: "GET",
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    headers: {
      type: Schema.Types.Mixed,
      default: {},
    },
    body: {
      type: String,
      default: "",
    },
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Request = model<IRequest>("Request", requestSchema);