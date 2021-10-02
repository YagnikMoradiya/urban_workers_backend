import express from "express";
import { createReview } from "../controllers/review";

const router = express.Router();

router.post("/create-review", createReview.validator, createReview.controller);

export default router;
