import { model, Schema } from "mongoose";

interface State {
    active: boolean,
    name: string,
    country: string,
    state_code: string
}

const StateSchema = new Schema<State>({
    active: {type: Boolean, default: true},
    name: {type: String, required: true},
    state_code: {type: String, required: true},
    country: {type: String, required: true}
})

StateSchema.statics.findAll = function () {
    return this.find({}).exec();
};

StateSchema.statics.findByState = function (name: string) {
    return this.findOne({"country": name}).exec();
};

const StateModel = model<State>('State', StateSchema)

export default StateModel;