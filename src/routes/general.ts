import express from "express";
import { getCategory } from "../controllers/general";

const router = express.Router();

router.get("/category", getCategory.controller);

export default router;