import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { Service, Shop } from "../models";
import APIResponse from "../utils/APIResponse";

const createService = {
  validator: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      time: Joi.number().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const newService = new Service({ ...req.body, shopId: req.user.id });
      const service = await newService.save();

      if (!service) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in creating service",
              httpStatus.BAD_REQUEST
            )
          );
      }

      await Shop.findOneAndUpdate(
        { _id: req.user.id, is_deleted: false },
        { $push: { service: service._id } }
      );

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            service,
            "Service created successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in creating service",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const deleteService = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response) => {
    try {
      const service = await Shop.findServiceAndDeleteById(
        req.user.id,
        req.params.id
      );

      // findOneAndUpdate(
      //   {
      //     _id: Types.ObjectId(req.user.id),
      //     service: { $in: req.params.id },
      //   },
      //   { $pullAll: { service: [Types.ObjectId(req.params.id)] } }
      // );

      if (!service) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in deleting service || No service",
              httpStatus.BAD_REQUEST
            )
          );
      }

      await Service.findByIdAndDelete(req.params.id);

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(null, "Service deleted successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in deleting service",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const updateService = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      name: Joi.string(),
      time: Joi.number(),
      price: Joi.number(),
      description: Joi.string(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const service = await Service.findOneAndUpdate(
        { _id: req.params.id, shopId: req.user.id },
        req.body,
        { new: true }
      );

      if (!service) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "There is no service || Only owner can change services",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            service,
            "Service Updated successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in updating service",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export { createService, deleteService, updateService };
