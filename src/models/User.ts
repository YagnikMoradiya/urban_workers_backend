import { model, Schema } from "mongoose";
import { EnumType } from "typescript";
import { GenderType } from "../utils/constant";

interface User {
    name: string;
    email: string;
    password: string;
    phone: string;
    avatar: string;
    gender: EnumType;
    address: Array<any>;
    is_verified: boolean;
}

const userSchema = new Schema<User>(
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
            type: Schema.Types.ObjectId,
            ref: "Address"
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

const UserModel = model<User>("User", userSchema);

export default UserModel;
