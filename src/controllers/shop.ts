import express, { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { comparePassword, hashPassword } from "../utils/utils";
import { Shop } from "../models";
import { getJWTToken } from "../utils/jwt.helper";
import httpStatus from "http-status";
import APIResponse from "../utils/APIResponse";

const register = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      ownerName: Joi.string().required(),
      phone: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const new_shop = new Shop({
        email: req.body.email,
        password: await hashPassword(req.body.password, 10),
        avatar: null,
        name: req.body.name,
        phone: req.body.phone,
        owner_name: req.body.ownerName
      });

      const shop = await new_shop.save();

      if (shop) {
        const token = getJWTToken({
          id: shop._id,
          name: shop.name,
          email: shop.email,
          is_verified: shop.is_verified,
        });

        const userData = {
          id: shop._id,
          name: shop.name,
          email: shop.email,
          avatar: shop.avatar,
          owner_name: shop.owner_name,
          is_verified: shop.is_verified,
          token,
        };

        return res
          .status(httpStatus.OK)
          .json(new APIResponse(userData, "User added.", httpStatus.OK));
      }
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, "User not added.", httpStatus.BAD_REQUEST));
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "User not added.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const login = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const shop_exists = await Shop.findOne({
        email: req.body.email,
        is_deleted: false,
      });

      if (!shop_exists) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(new APIResponse(null, "Wrong Email", httpStatus.BAD_REQUEST));
      }

      const password_check = await comparePassword(
        req.body.password,
        shop_exists.password
      );

      if (!password_check) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "Wrong Password", httpStatus.BAD_REQUEST)
          );
      }

      const token = getJWTToken({
        id: shop_exists._id,
        name: shop_exists.name,
        email: shop_exists.email,
        is_verified: shop_exists.is_verified,
      });

      const userData = {
        id: shop_exists._id,
        email: shop_exists.email,
        name: shop_exists.name,
        avatar: shop_exists.avatar,
        is_verified: shop_exists.is_verified,
        token,
      };

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            userData,
            "Shop LoggedIn successfully.",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Shop not login sussecfully.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const validateShop = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const shop_exists = await Shop.findOne({
        _id: req.user.id,
        is_deleted: false,
      });

      if (!shop_exists) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(
            new APIResponse(null, "Unauthorized Shop", httpStatus.UNAUTHORIZED)
          );
      }

      const token = getJWTToken({
        id: shop_exists._id,
        name: shop_exists.name,
        email: shop_exists.email,
        is_verified: shop_exists.is_verified,
      });

      const userData = {
        id: shop_exists._id,
        email: shop_exists.email,
        name: shop_exists.name,
        avatar: shop_exists.avatar,
        is_verified: shop_exists.is_verified,
        token,
      };
      return res
        .status(httpStatus.OK)
        .json(new APIResponse(userData, "Shop Found", httpStatus.OK));
    } catch (error) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(
          new APIResponse(null, "Unauthorized Shop", httpStatus.UNAUTHORIZED)
        );
    }
  },
};

export { register, login, validateShop };
