import { celebrate, Joi } from "celebrate";
import { Request, Response, text } from "express";
import httpStatus from "http-status";
import { Schema, Types } from "mongoose";
import { Conversation, Message } from "../models";
import APIResponse from "../utils/APIResponse";

const createConversation = {
  validator: celebrate({
    body: Joi.object().keys({
      receiverId: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    const conversationData = {
      members: [req.user.id, req.body.receiverId],
      [`${req.user.id}_image`]: req.body[`${req.user.id}_image`],
      [`${req.user.id}_name`]: req.body[`${req.user.id}_name`],
      [`${req.body.receiverId}_image`]:
        req.body[`${req.body.receiverId}_image`],
      [`${req.body.receiverId}_name`]: req.body[`${req.body.receiverId}_name`],
      lastMessage: "",
    };
    try {
      const newConversation = new Conversation(conversationData);

      const conversation = await newConversation.save();

      if (!conversation) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in create conversations",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            conversation,
            "Conversations created successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in create conversations",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getConversation = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.user.id],
        },
      });

      if (!conversations) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting conversations",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            conversations,
            "Conversations get successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting conversations",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getConversationWorker = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      });

      if (!conversations) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting conversations",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            conversations,
            "Conversations get successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting conversations",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const createMessage = {
  validator: celebrate({
    body: Joi.object().keys({
      conversationId: Joi.string().required(),
      senderId: Joi.string().required(),
      text: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newMessage = new Message(req.body);

      const message = await newMessage.save();

      if (!message) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error creating message",
              httpStatus.BAD_REQUEST
            )
          );
      }

      await Conversation.findByIdAndUpdate(req.body.conversationId, {
        lastMessage: req.body.text,
      });

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(message, "Message sent successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error creating message",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getMessages = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const messages = await Message.find({
        conversationId: req.params.id,
      });

      if (!messages) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting message",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(messages, "Message got susseccfully.", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting message",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export {
  createConversation,
  getConversation,
  createMessage,
  getMessages,
  getConversationWorker,
};
