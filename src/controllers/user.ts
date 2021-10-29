import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { User } from "../models";
import {
  comparePassword,
  generateRandomNumber,
  hashPassword,
} from "../utils/utils";
import APIResponse from "../utils/APIResponse";
import { GenderType, RoleType } from "../utils/constant";
import { getJWTToken } from "../utils/jwt.helper";
import { uploadImage } from "../utils/fileUpload";
import { sendEmailHelper } from "../utils/emailer";
import { createAddress } from "./address";

let otp: any = {};

const register = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      phone: Joi.string().required(),
      gender: Joi.string()
        .valid(GenderType.male, GenderType.female, GenderType.other)
        .required(),
      is_verified: Joi.boolean().invalid(false),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const new_user = new User({
        email: req.body.email,
        password: await hashPassword(req.body.password, 10),
        avatar: null,
        name: req.body.name,
        phone: req.body.phone,
        gender: req.body.gender,
        is_verified: req.body.is_verified,
      });

      const user = await new_user.save();

      if (user) {
        const token = getJWTToken({
          id: user._id,
          name: user.name,
          email: user.email,
          role: RoleType.user,
        });

        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          gender: user.gender,
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
      const user_exists = await User.findOne({
        email: req.body.email,
        is_deleted: false,
      });

      if (!user_exists) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(new APIResponse(null, "Wrong Email", httpStatus.BAD_REQUEST));
      }

      const password_check = await comparePassword(
        req.body.password,
        user_exists.password
      );

      if (!password_check) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "Wrong Password", httpStatus.BAD_REQUEST)
          );
      }

      const token = getJWTToken({
        id: user_exists._id,
        name: user_exists.name,
        email: user_exists.email,
        role: RoleType.user,
      });

      const userData = {
        id: user_exists._id,
        email: user_exists.email,
        phone: user_exists.phone,
        name: user_exists.name,
        avatar: user_exists.avatar,
        gender: user_exists.gender,
        token,
      };

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            userData,
            "User LoggedIn successfully.",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "User not found.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const editUser = {
  validator: celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      phone: Joi.string(),
      password: Joi.string(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const user_exists = await User.findOne({
        _id: req.user.id,
        is_deleted: false,
      });

      if (!user_exists) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "User not found.", httpStatus.BAD_REQUEST)
          );
      }

      if (req.files.length) {
        const imgUrl = await uploadImage(req.files[0]);
        req.body["avatar"] = imgUrl;
      }

      const user = await User.findOneAndUpdate(
        {
          _id: req.user.id,
          is_deleted: false,
        },
        req.body,
        { new: true }
      );

      if (!user) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "User not edited.", httpStatus.BAD_REQUEST)
          );
      }

      const token = getJWTToken({
        id: user._id,
        name: user.name,
        email: user.email,
        role: RoleType.user,
      });

      const userData = {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        gender: user.gender,
        token,
      };
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(userData, "User edit successfully.", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "User not edited.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const validateUser = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const user_exists = await User.findOne({
        _id: req.user.id,
        is_deleted: false,
      });

      if (!user_exists) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(
            new APIResponse(null, "Unauthorized User", httpStatus.UNAUTHORIZED)
          );
      }

      const token = getJWTToken({
        id: user_exists._id,
        name: user_exists.name,
        email: user_exists.email,
        role: RoleType.user,
      });

      const userData = {
        id: user_exists._id,
        email: user_exists.email,
        name: user_exists.name,
        avatar: user_exists.avatar,
        gender: user_exists.gender,
        token,
      };
      return res
        .status(httpStatus.OK)
        .json(new APIResponse(userData, "User Found", httpStatus.OK));
    } catch (error) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(
          new APIResponse(null, "Unauthorized User", httpStatus.UNAUTHORIZED)
        );
    }
  },
};

const sendOtp = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const user_exists = await User.findOne({
        email: req.body.email,
        is_deleted: false,
      });

      if (!user_exists) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(new APIResponse(null, "Wrong Email.", httpStatus.BAD_REQUEST));
      }

      const randNumber = generateRandomNumber();
      if (otp[req.body.email] && otp[req.body.email].length) {
        otp[req.body.email] = [...otp[req.body.email], randNumber];
      } else {
        otp[req.body.email] = [randNumber];
      }

      console.log(otp);

      const info = await sendEmailHelper(req.body.email, "OTP", randNumber);
      if (info) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(null, "Otp sent", httpStatus.OK));
      }
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(null, "Otp did not send", httpStatus.BAD_REQUEST)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(null, "OTP did not send.", httpStatus.BAD_REQUEST)
        );
    }
  },
};

const forgotPassword = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      otp: Joi.number().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const user_exists = await User.findOne({
        email: req.body.email,
        is_deleted: false,
      });

      if (!user_exists) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(new APIResponse(null, "Wrong Email.", httpStatus.BAD_REQUEST));
      }

      if (otp[req.body.email] && otp[req.body.email].includes(req.body.otp)) {
        delete otp[req.body.email];
        await User.updateOne(
          {
            email: req.body.email,
            is_deleted: false,
          },
          {
            password: await hashPassword(req.body.password, 10),
          }
        );

        return res
          .status(httpStatus.OK)
          .json(new APIResponse(null, "Password changed", httpStatus.OK));
      }
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, "Wrong OTP", httpStatus.BAD_REQUEST));
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Password doesnt change.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const addAdress = {
  validator: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      streetAddress: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const new_address = await createAddress({
        ...req.body,
        createdOn: req.user.id,
      });

      if (!new_address) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "Address not added.", httpStatus.BAD_REQUEST)
          );
      }

      await User.findOneAndUpdate(
        { _id: req.user.id, is_deleted: false },
        { $push: { address: new_address._id } }
      );

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            new_address,
            "Address added successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in address add",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export {
  register,
  login,
  validateUser,
  editUser,
  sendOtp,
  forgotPassword,
  addAdress,
};
