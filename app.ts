import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_URL } from "./src/config/dbconfig";
import { setup } from "./src/routes/index";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error in connecting db", err);
  });

setup(app);

app.get("/", (req, res) => {
  res.send("Hello Chatty");
});
