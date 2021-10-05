import express from "express";
import {
  addEndTime,
  addStartTime,
  changeStatus,
  createOrder,
  getOrders,
} from "../controllers/order";

const router = express.Router();

router.post("/add-order", createOrder.validator, createOrder.controller);

router.get("/get-order", getOrders.controller);

router.put(
  "/change-status/:orderId",
  changeStatus.validator,
  changeStatus.controller
);

router.put(
  "/add-startTime/:orderId",
  addStartTime.validator,
  addStartTime.controller
);

router.put(
  "/add-endTime/:orderId",
  addEndTime.validator,
  addEndTime.controller
);

export default router;
