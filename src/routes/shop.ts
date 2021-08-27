import express from "express";
import { register, login, validateShop } from "../controllers/shop";
import { shopAlreadyExists } from "../utils/middleware";

const router = express.Router();

router.post(
  "/register",
  register.validator,
  shopAlreadyExists,
  register.controller
);

router.post("/login", login.validator, login.controller);

router.get("/validate-token", validateShop.controller);
export default router;
