import dotenv from "dotenv";
dotenv.config();

let DB_URL: string;

const production = process.env.ONLINE_DB_URL;

const test = process.env.DB_URL;

switch (process.env.NODE_ENV) {
  case "development":
    DB_URL = test;
    break;
  case "production":
    DB_URL = production;
    break;
  default:
    DB_URL = test;
    break;
}

export { DB_URL };
