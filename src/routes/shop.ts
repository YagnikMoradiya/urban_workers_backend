import express from "express";
import { upload } from "../utils/multer";
import {
  register,
  login,
  validateShop,
  updateGeneralDeatailOfShop,
  addEmployee,
  addAddress,
  setVerifiedFlag,
} from "../controllers/shop";
import { shopAlreadyExists, shopExists } from "../utils/middleware";

const router = express.Router();

router.post(
  "/register",
  register.validator,
  shopAlreadyExists,
  register.controller
);

router.post("/login", login.validator, login.controller);

router.get("/validate-token", validateShop.controller);

router.post(
  "/general-detail",
  updateGeneralDeatailOfShop.validator,
  updateGeneralDeatailOfShop.controller
);

router.post(
  "/add-employee",
  shopExists,
  upload.any(),
  addEmployee.validator,
  addEmployee.controller
);

router.post(
  "/add-address",
  shopExists,
  addAddress.validator,
  addAddress.controller
);

router.get("/shop-verified", setVerifiedFlag.controller);

export default router;
