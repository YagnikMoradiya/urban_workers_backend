import mongoose from "mongoose";
import fs from 'fs';
import path from 'path'
import { DB_URL } from '../config/dbconfig';
import { State } from '../models';

const stateFile = path.join(__dirname, "../utils/stateData.json");

let states = [
    {
        name: "Gujarat",
        country: "India"
    }
]

if (fs.existsSync(stateFile)) {
    var statesData = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
    states = statesData.map((s:any) => ({ ...s, country: "India" }))
}

mongoose
    .connect(DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
    .then(async () => {
        //   To delete state collection data
        await State.deleteMany({})

        // Add many all the connections in states document
        State.insertMany(states).catch(err => console.log(err))
        console.log(`${states.length} states added.`);
    })
    .catch((err) => {
        console.log("Error in connecting db", err);
    });
