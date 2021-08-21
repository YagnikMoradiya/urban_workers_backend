import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { User } from "../models";
import { comparePassword, hashPassword } from "../utils/utils";
import APIResponse from "../utils/APIResponse";
import { GenderType } from "../utils/constant";
import { getJWTToken } from "../utils/jwt.helper";

const register = {
    validator: celebrate({
        body: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required(),
            name: Joi.string().required(),
            phone: Joi.string().required(),
            gender: Joi.string().valid(GenderType.male, GenderType.female, GenderType.other).required(),
            is_verified: Joi.boolean().invalid(false)
        })
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
                is_verified: req.body.is_verified
            })

            const user = await new_user.save();

            if (user) {
                const token = getJWTToken({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                });

                const userData = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
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
                .json(new APIResponse(null, "User not added.", httpStatus.BAD_REQUEST, error));
        }
    }
}

const login = {
    validator: celebrate({
        body: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
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
}

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

export { register, login, validateUser }