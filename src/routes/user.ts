import express from "express";
import { userAlreadyExists } from "../utils/middleware";
import { login, register, validateUser } from "../controllers/user";

const router = express.Router();

router.post('/register', register.validator, userAlreadyExists, register.controller)

router.post('/login', login.validator, login.controller)

router.get('/validate-token', validateUser.controller)

export default router;