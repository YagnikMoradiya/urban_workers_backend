import { model, Schema } from "mongoose";

interface Address {
    name: string,
    streetAddress: string,
    streetNumber: string,
    city: string,
    state: string,
    zipCode: string,
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
        streetNumber: {
            type: String,
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
            required: true
        },
        primaryAddress: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

const AddressModel = model<Address>("Address", addressSchema);

export default AddressModel;
