import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { uploadImage } from "../utils/fileUpload";
import { Review, Service, Shop } from "../models";
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
      if (req.files.length) {
        const imgUrl = await uploadImage(req.files[0]);
        req.body["image"] = imgUrl;
      }
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
      if (req.files.length) {
        const imgUrl = await uploadImage(req.files[0]);
        req.body["image"] = imgUrl;
      }

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

const getServices = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const services = await Service.find({
        shopId: req.user.id,
      });

      if (!services) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in updating service",
              httpStatus.BAD_REQUEST
            )
          );
      }
      const review: [] = await Review.findAvgStar();
      const result = new Map(review.map((i: any) => [i._id, i.star]));

      let newObj = services.map((a: any) => ({
        _id: a._id,
        avatar: a.image,
        description: a.description,
        price: a.price,
        time: a.time,
        name: a.name,
        shopId: a.shopId,
        updatedAt: a.updatedAt,
        star:
          result.get(a._id.toString()) > 0 ? result.get(a._id.toString()) : 0,
      }));

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            newObj,
            "Services getting successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting services",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export { createService, deleteService, updateService, getServices };
