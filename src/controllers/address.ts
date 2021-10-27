import { celebrate, Joi } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import APIResponse from "../utils/APIResponse";
import { Address, Shop, User } from "../models";
import { RoleType } from "../utils/constant";
import { Types } from "mongoose";

interface Body {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  createdOn: Types.ObjectId;
}

const createAddress = (body: Body): Promise<any> => {
  const address = new Address({
    name: body.name,
    streetAddress: body.streetAddress,
    city: body.city,
    state: body.state,
    zipCode: body.zipCode,
    createdOn: body.createdOn,
  });

  return address.save();
};

const deleteAddress = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      let address;
      if (req.user.role === RoleType.shop) {
        address = await Shop.findAddressAndDeleteById(
          req.user.id,
          req.params.id
        );
      } else {
        address = await User.findAddressAndDeleteById(
          req.user.id,
          req.params.id
        );
      }

      if (!address) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Address not found Or Only Owner can delete the address",
              httpStatus.BAD_REQUEST
            )
          );
      }
      await Address.deleteOne({ _id: req.params.id });

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(null, "Address deleted successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in deleting Address",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const updateAddress = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      name: Joi.string(),
      streetAddress: Joi.string(),
      houseNumber: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const address = await Address.findOneAndUpdate(
        { _id: req.params.id, createdOn: req.user.id },
        req.body,
        { new: true }
      );

      if (!address) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "There is no Address || Only owner can update the address",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            address,
            "Address updated successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in updating Address",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getUsersAddress = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const addresses = await Address.find({
        createdOn: req.user.id,
      });

      if (!addresses) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting Address",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(addresses, "Address got successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting Address",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export { createAddress, deleteAddress, updateAddress, getUsersAddress };
