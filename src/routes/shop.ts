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
  getShopData,
  getNearestShop,
  getTrackOfDetail,
  getShopBasicData,
} from "../controllers/shop";
import { shopAlreadyExists, shopExists } from "../utils/middleware";

const router = express.Router();

router.get("/get-shop/:id", getShopData.controller);

router.get(
  "/get-nearest-shop/:category",
  getNearestShop.validator,
  getNearestShop.controller
);

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

router.get("/shopdata-track", getTrackOfDetail.controller);

router.get(
  "/shopdata-basic/:shopId",
  getShopBasicData.validator,
  getShopBasicData.controller
);

export default router;
