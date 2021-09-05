import { Response } from "express";
import { Model, model, Schema, Types } from "mongoose";

interface IShop {
  email: string;
  password: string;
  avatar: string;
  name: string;
  owner_name: string;
  address: [Types.ObjectId];
  phone: string;
  category: string;
  start_time: number;
  end_time: number;
  city: string;
  state: string;
  staff: [Types.ObjectId];
  service: [Types.ObjectId];
  is_deleted: boolean;
  is_verified: boolean;
}

interface ShopModel extends Model<IShop> {
  findEmployeeAndDeleteById(Oid: string, Wid: string): Promise<Response>;
  findAddressAndDeleteById(Oid: string, Aid: string): Promise<Response>;
  findServiceAndDeleteById(Oid: string, Sid: string): Promise<Response>;
}

const stringRequired = {
  type: String,
  required: true,
};

const ShopSchema = new Schema<IShop, ShopModel>(
  {
    email: stringRequired,
    password: stringRequired,
    name: stringRequired,
    avatar: {
      type: String,
      default: "",
    },
    owner_name: String,
    address: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Address",
        },
      ],
    },
    phone: stringRequired,
    category: String,
    start_time: String,
    end_time: String,
    city: String,
    state: String,
    staff: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Worker",
        },
      ],
    },
    service: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Service",
        },
      ],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ShopSchema.statics.findEmployeeAndDeleteById = function (
  Oid: string,
  Wid: string
) {
  return this.findOneAndUpdate(
    {
      _id: Types.ObjectId(Oid),
      staff: { $in: [Types.ObjectId(Wid)] },
    },
    { $pullAll: { staff: [Types.ObjectId(Wid)] } }
  );
};

ShopSchema.statics.findAddressAndDeleteById = function (
  Oid: string,
  Aid: string
) {
  return this.findOneAndUpdate(
    { _id: Types.ObjectId(Oid), address: { $in: [Types.ObjectId(Aid)] } },
    { $pullAll: { address: [Types.ObjectId(Aid)] } }
  );
};

ShopSchema.statics.findServiceAndDeleteById = function (
  Oid: string,
  Sid: string
) {
  return this.findOneAndUpdate(
    {
      _id: Types.ObjectId(Oid),
      service: { $in: [Types.ObjectId(Sid)] },
    },
    { $pullAll: { service: [Types.ObjectId(Sid)] } }
  );
};

// findOneAndUpdate(
//   {
//     _id: Types.ObjectId(req.user.id),
//     service: { $in: req.params.id },
//   },
//   { $pullAll: { service: [Types.ObjectId(req.params.id)] } }
// );

const shopModel = model<IShop, ShopModel>("Shop", ShopSchema);

export default shopModel;
