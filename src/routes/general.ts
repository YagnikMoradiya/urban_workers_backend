import express from "express";
import { getCategory, getCity, getState } from "../controllers/general";

const router = express.Router();

router.get("/category", getCategory.controller);

router.get("/state", getState.controller);

router.get("/city/:name", getCity.validator, getCity.controller);

export default router;
