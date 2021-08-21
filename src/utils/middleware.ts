import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { User } from "../models/index";
import APIResponse from "./APIResponse";

const userAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
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

export { userAlreadyExists };
