import { Model, model, Schema, Types } from "mongoose";
import { EnumType } from "typescript";
import { GenderType } from "../utils/constant";

interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  gender: EnumType;
  address: [Types.ObjectId];
  is_verified: boolean;
}

interface UserModel extends Model<IUser> {
  findAddressById(Uid: string, Aid: string): Promise<Response>;
  findAddressAndDeleteById(Uid: string, Aid: string): Promise<Response>;
}

const UserSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: GenderType,
      default: GenderType.male,
    },
    address: {
      type: [Schema.Types.ObjectId],
      ref: "Address",
    },
    is_verified: {
      type: Boolean,
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.statics.findAddressAndDeleteById = function (
  Uid: string,
  Aid: string
) {
  return this.findOneAndUpdate(
    { _id: Types.ObjectId(Uid) },
    { $pull: { address: [Types.ObjectId(Aid)] } }
  );
};

const UserModel = model<IUser, UserModel>("User", UserSchema);

export default UserModel;
