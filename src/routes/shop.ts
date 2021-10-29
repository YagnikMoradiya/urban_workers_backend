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
  searchShop,
  sendOtp,
  forgotPassword,
  editShop,
  shopBasicData,
} from "../controllers/shop";
import { shopAlreadyExists, shopExists } from "../utils/middleware";
import multer from "multer";

const router = express.Router();

router.get("/get-shop/:id", getShopData.controller);

router.post(
  "/get-nearest-shop",
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

router.put("/edit", upload.any(), editShop.validator, editShop.controller);

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

router.get("/search-shop", searchShop.validator, searchShop.controller);

router.post("/send-otp", sendOtp.validator, sendOtp.controller);

router.post(
  "/forgot-password",
  forgotPassword.validator,
  forgotPassword.controller
);

router.get("/shop-basic", shopBasicData.controller);

export default router;
