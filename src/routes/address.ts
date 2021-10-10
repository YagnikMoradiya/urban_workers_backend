import express from "express";
import {
  deleteAddress,
  getUsersAddress,
  updateAddress,
} from "../controllers/address";

const router = express.Router();

router.get("/get-address", getUsersAddress.controller);

router.delete("/:id", deleteAddress.validator, deleteAddress.controller);

router.put(
  "/update-address/:id",
  updateAddress.validator,
  updateAddress.controller
);

export default router;
