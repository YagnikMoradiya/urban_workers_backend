import httpStatus from "http-status";
import { User } from "../models/index.js";
import APIResponse from "./APIResponse.js";

const userAlreadyExists = async (req, res, next) => {
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
