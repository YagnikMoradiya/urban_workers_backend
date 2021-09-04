import express from "express";
import { deleteAddress } from "../controllers/address";

const router = express.Router();

router.delete("/:id", deleteAddress.validator, deleteAddress.controller);

export default router;
