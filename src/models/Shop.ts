import { model, Schema } from "mongoose";

interface Shop {
  email: string;
  password: string;
  avatar: string;
  name: string;
  owner_name: string;
  address: ArrayBuffer;
  phone: string;
  category: ArrayBuffer;
  time: string;
  city: string;
  state: string;
  staff: ArrayBuffer;
  is_deleted: boolean;
  is_verified: boolean;
}

const stringRequired = {
  type: String,
  required: true,
};

const shopSchema = new Schema<Shop>({
  email: stringRequired,
  password: stringRequired,
  name: stringRequired,
  avatar: {
    type: String,
    default: "",
  },
  owner_name: String,
  address: [Schema.Types.ObjectId],
  phone: stringRequired,
  category: [String],
  time: Date,
  city: String,
  state: String,
  staff: [Schema.Types.ObjectId],
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
});

const shopModel = model<Shop>("Shop", shopSchema);

export default shopModel;
