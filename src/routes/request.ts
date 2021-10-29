import express from "express";
import { changeStatus, getRequest, startService } from "../controllers/request";

const router = express.Router();

router.post("/add-request", startService.validator, startService.controller);

router.post("/change-status", changeStatus.validator, changeStatus.controller);

router.get("/get-request", getRequest.validator, getRequest.controller);

export default router;
