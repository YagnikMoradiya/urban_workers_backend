import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import {
  comparePassword,
  generateRandomNumber,
  hashPassword,
} from "../utils/utils";
import { Address, Review, Service, Shop, Worker } from "../models";
import { getJWTToken } from "../utils/jwt.helper";
import httpStatus from "http-status";
import APIResponse from "../utils/APIResponse";
import { createAddress } from "../controllers/address";
import { uploadImage } from "../utils/fileUpload";
import validateShopProperty from "../utils/validateShopProperty";
import { FilterType, RoleType } from "../utils/constant";
import { Types } from "mongoose";
import { sendEmailHelper } from "../utils/emailer";

let otp: any = {};

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

const editShop = {
  validator: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response) => {
    try {
      const shop_exists = await Shop.findOne({
        _id: req.user.id,
        is_deleted: false,
      });

      if (!shop_exists) {
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

      const shop = await Shop.findOneAndUpdate(
        {
          _id: req.user.id,
          is_deleted: false,
        },
        req.body,
        { new: true }
      );

      if (!shop) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "Shop not edited.", httpStatus.BAD_REQUEST)
          );
      }

      const token = getJWTToken({
        id: shop._id,
        name: shop.name,
        email: shop.email,
        role: RoleType.shop,
      });

      const shopData = {
        id: shop._id,
        name: shop.name,
        email: shop.email,
        avatar: shop.avatar,
        is_verified: shop.is_verified,
        token,
      };
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(shopData, "User edit successfully.", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Shop not edited.",
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
      state: Joi.string().required(),
      city: Joi.string().required(),
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

const searchShop = {
  validator: celebrate({
    query: Joi.object().keys({
      shopName: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const shop = await Shop.find({
        name: { $regex: req.query.shopName, $options: "i" },
      }).populate({
        path: "service",
      });

      if (!shop) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "Can't find shop.", httpStatus.BAD_REQUEST)
          );
      }

      const shopData = shop.map((s) => {
        let image = [s?.avatar];
        s.service.map((ss: any) => {
          image.push(ss?.image);
        });

        return {
          shopId: s._id,
          shopName: s.name,
          ownerName: s.owner_name,
          category: s.category,
          service: s.service.map((ss: any) => ss.name),
          image,
        };
      });

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(shopData, "Shops get successfully..", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Can't find shop.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

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
  validator: celebrate({
    body: Joi.object().keys({
      filter: Joi.string()
        .allow(FilterType.city, FilterType.pincode, "")
        .required(),
      keyword: Joi.string().allow("").required(),
      category: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      let shopIds;
      if (req.body.filter === "") {
        shopIds = await Address.find().select("createdOn");
      } else if (req.body.filter === FilterType.city) {
        shopIds = await Address.find({
          city: {
            $regex: req.body.keyword,
            $options: "i",
          },
        }).select("createdOn");
      } else if (req.body.filter === FilterType.pincode) {
        shopIds = await Address.find({
          zipCode: {
            $regex: req.body.keyword,
            $options: "i",
          },
        }).select("createdOn");
      } else {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "Bad Filter Applied.", httpStatus.BAD_REQUEST)
          );
      }

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

      shopIds = shopIds.map((id: any) => id.createdOn);

      const shops = await Shop.find({
        _id: { $in: shopIds },
        category: {
          $regex: req.body.category,
          $options: "i",
        },
      })
        .select("service")
        .select("name");

      if (!shops) {
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

      const serviceIds: Types.ObjectId[] = [];

      // To get All service Id
      shops.map((s) => {
        s.service.map((ss) => {
          serviceIds.push(ss);
        });
      });

      const service = await Service.find({
        _id: { $in: serviceIds },
      });

      if (!service) {
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

      const review: [] = await Review.findAvgStar();
      const reviewResult = new Map(review.map((i: any) => [i._id, i.star]));
      const shopResult = new Map(
        shops.map((i: any) => [i._id.toString(), i.name])
      );

      const data = service.map((s) => {
        return {
          serviceId: s._id,
          shopId: s.shopId,
          image: s.image,
          serviceName: s.name,
          shopName: shopResult.get(s.shopId),
          time: s.time,
          price: s.price,
          description: s.description,
          star:
            reviewResult.get(s._id.toString()) > 0
              ? reviewResult.get(s._id.toString())
              : 0,
        };
      });

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(data, "ShopData got successfully", httpStatus.OK)
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

const getShopBasicData = {
  validator: celebrate({
    params: Joi.object().keys({
      shopId: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const shop = await Shop.findOne({
        _id: req.params.id,
        is_deleted: false,
        // is_verified: true
      });

      if (!shop) {
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

      const data = {
        shopId: shop._id,
        shopName: shop.name,
        description: shop.description,
      };

      return res
        .status(httpStatus.OK)
        .json(new APIResponse(data, "Shops got successfully", httpStatus.OK));
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

const sendOtp = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const user_exists = await Shop.findOne({
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
      const user_exists = await Shop.findOne({
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
        await Shop.updateOne(
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

const shopBasicData = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const shopData = await Shop.findOne({
        _id: req.user.id,
        is_deleted: false,
      });

      if (!shopData) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "ShopData not found.", httpStatus.BAD_REQUEST)
          );
      }

      // const shopDataObj = {
      //   id: shopData._id,
      //   name: shopData.name,
      //   phone: shopData.phone,
      //   email: shopData.email,
      //   city: shopData.city,

      // }

      return res
        .status(httpStatus.OK)
        .json(new APIResponse(shopData, "ShopData found.", httpStatus.OK));
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "ShopData not found.",
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
  getShopBasicData,
  searchShop,
  forgotPassword,
  sendOtp,
  editShop,
  shopBasicData,
};
