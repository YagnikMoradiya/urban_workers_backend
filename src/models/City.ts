import { model, Schema } from "mongoose";

interface City {
    active: boolean,
    name: string,
    state: string,
}

const CitySchema = new Schema<City>({
    active: {type: Boolean, default: true},
    name: String,
    state: String,
})

CitySchema.statics.findAll = function () {
    return this.find({}).populate("state").exec();
};

CitySchema.statics.findByState = function (stateName: string) {
    return this.findOne({"state": stateName}).exec();
};

const CityModel = model<City>('City', CitySchema)

export default CityModel