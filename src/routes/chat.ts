import express from "express";
import {
  createConversation,
  createMessage,
  getConversation,
  getConversationWorker,
  getMessages,
} from "../controllers/chat";

const router = express.Router();

router.post(
  "/create-conversation",
  // createConversation.validator,
  createConversation.controller
);

router.get("/get-conversation", getConversation.controller);

router.get(
  "/get-conversation-worker/:id",
  getConversationWorker.validator,
  getConversationWorker.controller
);

router.post("/send-message", createMessage.validator, createMessage.controller);

router.get("/get-message/:id", getMessages.validator, getMessages.controller);

export default router;
