import { model, Schema } from "mongoose";
import { OrderType } from "../utils/constant";

const OrderSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [OrderType.pending, OrderType.ongoing, OrderType.completed],
      default: OrderType.pending,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: Date,
    endTime: Date,
    perHour: {
      type: Number,
      required: true,
    },
    totalCharge: Number,
    serviceId: { type: String, required: true },
    addressId: { type: String, required: true },
    userId: { type: String, required: true },
    workerId: { type: String, required: true },
  },
  { timestamps: true }
);

const OrderModel = model("Order", OrderSchema);

export default OrderModel;
