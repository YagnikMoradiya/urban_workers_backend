import express from "express";
import { upload } from "../utils/multer";
import { deleteWorker, updateWorker } from "../controllers/worker";

const router = express.Router();

router.delete("/:id", deleteWorker.validator, deleteWorker.controller);

router.put(
  "/update-worker/:id",
  upload.any(),
  updateWorker.validator,
  updateWorker.controller
);

export default router;
