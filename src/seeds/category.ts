import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { DB_URL } from "../config/dbconfig";
import { Category } from "../models";

let categories = [
    {
        name: "Plumbing"
    },
    {
        name: "Saloon"
    },
    {
        name: "Electrician"
    },
    {
        name: "Cleaning & Disinfection"
    }
];

const categoryFile = path.join(__dirname, "../utils/categoryData.json");

if (fs.existsSync(categoryFile)) {
    var categoriesData = JSON.parse(fs.readFileSync(categoryFile, 'utf-8'));
    categories = categoriesData;
}

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(async () => {
    await Category.deleteMany({});

    Category.insertMany(categories).catch(err => console.log(err));
    console.log(`${categories.length} categories added successfully`);
    
}).catch((err) => {
    console.log("Error in connecting db", err);
})
