import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Shop, User } from "../models/index";
import APIResponse from "./APIResponse";

const userAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const check = await User.findOne({
      email: req.body.email,
      is_deleted: false,
    }).exec();

    if (check) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "User Already exists with this email",
            httpStatus.BAD_REQUEST
          )
        );
    }
    next();
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(
        new APIResponse(
          null,
          "User Already exists with this email",
          httpStatus.BAD_REQUEST,
          error
        )
      );
  }
};

const userExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const check = await User.findOne({
      email: req.body.email,
      is_deleted: false,
    }).exec();

    if (check) {
      next();
    }
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(
        new APIResponse(
          null,
          "User not exists with this email",
          httpStatus.BAD_REQUEST
        )
      );
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(
        new APIResponse(
          null,
          "User not exists with this email",
          httpStatus.BAD_REQUEST,
          error
        )
      );
  }
};

const shopAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const check = await Shop.findOne({
      email: req.body.email,
      is_deleted: false,
    }).exec();

    if (check) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Shop Already exists with this email",
            httpStatus.BAD_REQUEST
          )
        );
    }
    next();
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(
        new APIResponse(
          null,
          "Shop Already exists with this email",
          httpStatus.BAD_REQUEST,
          error
        )
      );
  }
};

const shopExists = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const check = await Shop.findOne({
      _id: req.user.id,
      is_deleted: false,
    }).exec();

    if (!check) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Shop not exists with this id",
            httpStatus.BAD_REQUEST
          )
        );
    }
    next();
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(
        new APIResponse(
          null,
          "Shop not exists with this id",
          httpStatus.BAD_REQUEST,
          error
        )
      );
  }
};

export { userAlreadyExists, shopAlreadyExists, userExists, shopExists };
