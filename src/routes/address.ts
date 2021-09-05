import express from "express";
import { deleteAddress, updateAddress } from "../controllers/address";

const router = express.Router();

router.delete("/:id", deleteAddress.validator, deleteAddress.controller);

router.put(
  "/update-address/:id",
  updateAddress.validator,
  updateAddress.controller
);

export default router;
