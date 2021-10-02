import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { Review } from "../models";
import APIResponse from "../utils/APIResponse";

const createReview = {
  validator: celebrate({
    body: Joi.object().keys({
      content: Joi.string().required(),
      star: Joi.number().required(),
      service_id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const reviewObj = new Review({ ...req.body, user_id: req.user.id });

      const review = await reviewObj.save();
      if (!review) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in creating review",
              httpStatus.BAD_REQUEST
            )
          );
      }
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(review, "Review created successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in creating review",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export { createReview };
