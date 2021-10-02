import express from "express";
import { shopExists } from "../utils/middleware";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "../controllers/service";
import { upload } from "../utils/multer";

const router = express.Router();

router.get(
  "/",
  // getServices.validator,
  getServices.controller
);

router.post(
  "/add-service",
  shopExists,
  upload.any(),
  createService.validator,
  createService.controller
);

router.put(
  "/update-service/:id",
  upload.any(),
  updateService.validator,
  updateService.controller
);

router.delete(
  "/delete-service/:id",
  shopExists,
  deleteService.validator,
  deleteService.controller
);

export default router;
