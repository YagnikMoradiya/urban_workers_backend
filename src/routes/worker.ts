import express from "express";
import { upload } from "../utils/multer";
import {
  deleteWorker,
  getWorkers,
  getWorkersById,
  updateWorker,
} from "../controllers/worker";

const router = express.Router();

router.get("/", getWorkers.controller);

router.get("/:id", getWorkersById.validator, getWorkersById.controller);

router.delete("/:id", deleteWorker.validator, deleteWorker.controller);

router.put(
  "/update-worker/:id",
  upload.any(),
  updateWorker.validator,
  updateWorker.controller
);

export default router;
