import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { Like } from "../models";
import APIResponse from "../utils/APIResponse";

const createLike = {
  validator: celebrate({
    body: Joi.object().keys({
      service_id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const checkLike = await Like.findOne({
        service_id: req.body.service_id,
        user_id: req.user.id,
      });

      if (checkLike) {
        const dislike = await Like.deleteOne({
          service_id: req.body.service_id,
          user_id: req.user.id,
        });

        if (!dislike) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json(
              new APIResponse(
                null,
                "Error in disLiking",
                httpStatus.BAD_REQUEST
              )
            );
        }
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(null, "Dislike successfully", httpStatus.OK));
      }

      const likeObj = new Like({
        service_id: req.body.service_id,
        user_id: req.user.id,
      });

      const like = await likeObj.save();
      if (!like) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "Error in Liking", httpStatus.BAD_REQUEST)
          );
      }
      return res
        .status(httpStatus.OK)
        .json(new APIResponse(null, "Liked successfully", httpStatus.OK));
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in Liking",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export default { createLike };
