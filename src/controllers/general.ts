import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { Category, City, State } from "../models";
import APIResponse from "../utils/APIResponse";

const getCategory = {
  controller: async (req: Request, res: Response) => {
    try {
      const categories = await Category.find();

      if (!categories) {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json(
            new APIResponse(
              null,
              "Error to get categories",
              httpStatus.INTERNAL_SERVER_ERROR
            )
          );
      }

      const categoriesData = categories.map((c) => ({
        _id: c._id,
        name: c.name,
      }));

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(categoriesData, "Categories Found", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "Error to get categories",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  },
};

const getState = {
  controller: async (req: Request, res: Response) => {
    try {
      const states = await State.find();

      if (!states) {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json(
            new APIResponse(
              null,
              "Error to get states",
              httpStatus.INTERNAL_SERVER_ERROR
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(new APIResponse(states, "States Found", httpStatus.OK));
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "Error to get states",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  },
};

const getCity = {
  validator: celebrate({
    params: Joi.object().keys({
      name: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response) => {
    try {
      const cities = await City.find({
        state: {
          $regex: req.params.name,
          $options: "i",
        },
      });

      if (!cities) {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json(
            new APIResponse(
              null,
              "Error to get cities",
              httpStatus.INTERNAL_SERVER_ERROR
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(new APIResponse(cities, "cities Found", httpStatus.OK));
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "Error to get cities",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  },
};

export { getCategory, getState, getCity };
