import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { comparePassword, hashPassword } from "../utils/utils";
import { Address, Shop, Worker } from "../models";
import { getJWTToken } from "../utils/jwt.helper";
import httpStatus from "http-status";
import APIResponse from "../utils/APIResponse";
import { createAddress } from "../controllers/address";
import { uploadImage } from "../utils/fileUpload";
import validateShopProperty from "../utils/validateShopProperty";
import { RoleType } from "../utils/constant";
import { Types } from "mongoose";

const register = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
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
      });

      const shop = await new_shop.save();

      if (shop) {
        const token = getJWTToken({
          id: shop._id,
          name: shop.name,
          email: shop.email,
          role: RoleType.shop,
          is_verified: shop.is_verified,
        });

        const userData = {
          id: shop._id,
          name: shop.name,
          email: shop.email,
          avatar: shop.avatar,
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
        role: RoleType.shop,
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
        role: RoleType.shop,
        is_verified: shop_exists.is_verified,
      });

      const status = {
        generalDetail:
          shop_exists.owner_name && shop_exists.owner_name !== ""
            ? true
            : false,
        addressDetail: shop_exists.address.length > 0 ? true : false,
        employeeDetail: shop_exists.staff.length > 0 ? true : false,
        serviceDetail: shop_exists.service.length > 0 ? true : false,
      };

      const userData = {
        id: shop_exists._id,
        email: shop_exists.email,
        name: shop_exists.name,
        avatar: shop_exists.avatar,
        is_verified: shop_exists.is_verified,
        status,
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

const updateGeneralDeatailOfShop = {
  validator: celebrate({
    body: Joi.object().keys({
      owner_name: Joi.string().required(),
      category: Joi.string().required(),
      start_time: Joi.string().required(),
      end_time: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const shopDetail = await Shop.findOneAndUpdate(
        {
          _id: req.user.id,
          is_deleted: false,
        },
        req.body,
        { new: true }
      );

      if (!shopDetail) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in update general detail",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            shopDetail,
            "Update general detail successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "Error in update general detail",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  },
};

const updateShop = {};

const addAddress = {
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
      // location: Joi.object()
      //   .keys({
      //     type: Joi.string().required(),
      //     coordinates: Joi.array().required(),
      //   })
      //   .required(),
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
      await Shop.findOneAndUpdate(
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

const addEmployee = {
  validator: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      experience: Joi.number().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      if (req.files.length) {
        const imgUrl = await uploadImage(req.files[0]);
        req.body["avatar"] = imgUrl;
      }

      req.body.shopId = req.user.id;

      const worker = new Worker(req.body);
      const workerData = await worker.save();

      if (!workerData) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "Worker not added.", httpStatus.BAD_REQUEST)
          );
      }

      await Shop.findOneAndUpdate(
        { _id: req.user.id, is_deleted: false },
        { $push: { staff: workerData._id } }
      );

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            workerData,
            "Worker added successfully.",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Worker not added.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const setVerifiedFlag = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const shop_detail = await Shop.findById(req.user.id);

      if (!shop_detail) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in update verified status",
              httpStatus.BAD_REQUEST
            )
          );
      }

      if (!validateShopProperty(shop_detail)) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "Detail not verified", httpStatus.BAD_REQUEST)
          );
      }

      await Shop.findByIdAndUpdate(req.user.id, {
        is_verified: true,
      });

      return res
        .status(httpStatus.OK)
        .json(new APIResponse(null, "Shop is verified", httpStatus.OK));
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in update verified status",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getShopData = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const shop = await Shop.findOne({
        _id: req.user.id,
      })
        .select("+address")
        .select("+staff")
        .select("+service")
        .populate({
          path: "address",
        })
        .populate({
          path: "staff",
        })
        .populate({
          path: "service",
        });

      if (!shop) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting ShopData",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(shop, "ShopData got successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting ShopData",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getNearestShop = {
  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const shopIds = await Address.find({
        location: {
          $geoWithin: {
            $center: [[73.2051, 22.3003], 10],
          },
        },
        primaryAddress: true,
      }).select("_id");

      let ids = shopIds.map((id) => Types.ObjectId(id._id));

      const shops = await Shop.find({
        address: { $in: ids },
        category: {
          $regex: req.params.category,
          $options: "i",
        },
        is_verified: true,
      });

      if (!shopIds) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting ShopData",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(shops, "ShopData got successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting ShopData",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getTrackOfDetail = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const shopData = await Shop.findById(req.user.id);

      if (!shopData) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting ShopData",
              httpStatus.BAD_REQUEST
            )
          );
      }

      const resp = {
        generalDetail:
          shopData.owner_name && shopData.owner_name !== "" ? true : false,
        addressDetail: shopData.address.length > 0 ? true : false,
        employeeDetail: shopData.staff.length > 0 ? true : false,
        serviceDetail: shopData.service.length > 0 ? true : false,
      };

      return res
        .status(httpStatus.OK)
        .json(new APIResponse(resp, "ShopData status", httpStatus.OK));
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting ShopData",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getShopsByCategory = {
  validator: celebrate({
    params: Joi.object().keys({
      category: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const shops = await Shop.find({ category: req.params.category });

      if (!shops) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting Shops",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(new APIResponse(shops, "Shops got successfully", httpStatus.OK));
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting Shops",
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
  validateShop,
  addAddress,
  updateGeneralDeatailOfShop,
  setVerifiedFlag,
  addEmployee,
  getShopData,
  getNearestShop,
  getTrackOfDetail,
  getShopsByCategory,
};
