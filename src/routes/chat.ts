import express from "express";
import { createConversation, getConversation } from "../controllers/chat";

const router = express.Router();

router.post(
  "/create-conversation",
  // createConversation.validator,
  createConversation.controller
);

router.get("/get-conversation", getConversation.controller);

export default router;
