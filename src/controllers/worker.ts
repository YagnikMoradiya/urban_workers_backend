import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import APIResponse from "../utils/APIResponse";
import { Shop, Worker } from "../models";

const deleteWorker = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const worker = await Shop.findEmployeeAndDeleteById(
        req.user.id,
        req.params.id
      );

      if (!worker) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Worker not found Or Only Owner can delete the worker",
              httpStatus.BAD_REQUEST
            )
          );
      }
      await Worker.deleteOne({ _id: req.params.id });
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(null, "Worker deleted successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in deleting worker.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export { deleteWorker };
