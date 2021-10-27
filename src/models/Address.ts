import { model, Schema, Types } from "mongoose";

interface Address {
  name: string;
  streetAddress: string;
  streetNumber: string;
  city: string;
  state: string;
  zipCode: string;
  createdOn: string;
}

const addressSchema = new Schema<Address>(
  {
    name: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    primaryAddress: {
      type: Boolean,
      default: false,
    },
    createdOn: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const AddressModel = model<Address>("Address", addressSchema);

export default AddressModel;
