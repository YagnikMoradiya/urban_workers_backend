import { model, Schema } from "mongoose";
import { RequestType } from "../utils/constant";

interface IRequest {
  userId: string;
  shopId: string;
  orderId: string;
  status: string;
}

const RequestSchema = new Schema<IRequest>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    shopId: {
      type: String,
      required: true,
      ref: "Shop",
    },
    orderId: {
      type: String,
      required: true,
      ref: "Order",
    },
    type: {
      type: String,
      enum: ["START", "END"],
      default: "START",
    },
    status: {
      type: String,
      enum: [RequestType.pending, RequestType.accepted, RequestType.declined],
      default: RequestType.pending,
    },
  },
  { timestamps: true }
);

const RequestModel = model<IRequest>("Request", RequestSchema);

export default RequestModel;
