import { model, Schema, Types } from "mongoose";

interface IService {
  name: string;
  time: number;
  price: number;
  description: string;
  shopId: Types.ObjectId;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      requierd: true,
    },
    time: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shopId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const ServiceModel = model<IService>("Service", ServiceSchema);

export default ServiceModel;
