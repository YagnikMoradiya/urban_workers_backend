import express from "express";
import { deleteWorker } from "../controllers/worker";

const router = express.Router();

router.delete("/:id", deleteWorker.validator, deleteWorker.controller);

export default router;
