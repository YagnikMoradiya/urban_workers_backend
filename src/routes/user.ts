import express from "express";
import { userAlreadyExists } from "../utils/middleware";
import {
  addAdress,
  editUser,
  forgotPassword,
  login,
  register,
  sendOtp,
  validateUser,
} from "../controllers/user";
import { upload } from "../utils/multer";

const router = express.Router();

router.post(
  "/register",
  register.validator,
  userAlreadyExists,
  register.controller
);

router.post("/login", login.validator, login.controller);

router.get("/validate-token", validateUser.controller);

router.patch("/edit", upload.any(), editUser.validator, editUser.controller);

router.post("/send-otp", sendOtp.validator, sendOtp.controller);

router.post(
  "/forgot-password",
  forgotPassword.validator,
  forgotPassword.controller
);

router.post("/add-address", addAdress.validator, addAdress.controller);

export default router;
