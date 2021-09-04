import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { DB_URL } from "../config/dbconfig";
import { City } from "../models";

let cities = [
    {
        name: "Surat",
        state: "Gujarat"
    },
    {
        name: "Bhavnagar",
        state: "Gujarat"
    },
    {
        name: "Ahmedabad",
        state: "Gujarat"
    },
    {
        name: "Vadodara",
        state: "Gujarat"
    },
    {
        name: "Rajkot",
        state: "Gujarat"
    },
    {
        name: "Jamnagar",
        state: "Gujarat"
    },
];

const cityFile = path.join(__dirname, "../utils/cityData.json");

if (fs.existsSync(cityFile)) {
    var citiesData = JSON.parse(fs.readFileSync(cityFile, 'utf-8'));
    cities = citiesData;
}

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(async () => {
    await City.deleteMany({});

    City.insertMany(cities).catch(err => console.log(err));
    console.log(`${cities.length} cities added successfully`);
    
}).catch((err) => {
    console.log("Error in connecting db", err);
})
