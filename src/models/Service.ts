import { Model, model, Schema, Types } from "mongoose";
import { Review } from ".";

interface IService {
  name: string;
  time: number;
  price: number;
  description: string;
  shopId: string;
  image: string;
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
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const ServiceModel = model<IService>("Service", ServiceSchema);

export default ServiceModel;
