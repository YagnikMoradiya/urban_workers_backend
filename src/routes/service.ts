import express from "express";
import { shopExists } from "../utils/middleware";
import {
  createService,
  deleteService,
  updateService,
} from "../controllers/service";

const router = express.Router();

router.post(
  "/add-service",
  shopExists,
  createService.validator,
  createService.controller
);

router.put(
  "/update-service/:id",
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
