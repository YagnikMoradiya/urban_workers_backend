import { celebrate, Joi } from "celebrate";
import { Response } from "express";
import httpStatus from "http-status";
import APIResponse from "../utils/APIResponse";
import { Request } from "../models";
import { RequestType } from "../utils/constant";

const startService = {
  validator: celebrate({
    body: Joi.object().keys({
      userId: Joi.string().required(),
      orderId: Joi.string().required(),
      type: Joi.string().allow("START", "END").required(),
    }),
  }),

  controller: async (req: any, res: Response) => {
    try {
      const newRequest = new Request({
        shopId: req.user.id,
        userId: req.body.userId,
        orderId: req.body.orderId,
        type: req.body.type,
      });

      const request = await newRequest.save();

      if (!request) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in adding request.",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(request, "Request added successfully.", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in adding request.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const changeStatus = {
  validator: celebrate({
    body: Joi.object().keys({
      status: Joi.string().allow("ACCEPT", "DECLINE").required(),
      reqId: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response) => {
    try {
      let status;

      if (req.body.status === "ACCEPT") {
        status = RequestType.accepted;
      } else if (req.body.status === "DECLINE") {
        status = RequestType.declined;
      }

      const request = await Request.findOneAndUpdate(
        { _id: req.body.reqId, userId: req.user.id },
        {
          status,
        },
        { new: true }
      );

      if (!request) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in changing request status.",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            request,
            "Request status changed successfully.",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in changing request status.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getRequest = {
  validator: celebrate({
    query: Joi.object().keys({
      type: Joi.string().allow("USER", "SHOP").required(),
    }),
  }),

  controller: async (req: any, res: Response) => {
    try {
      let requestsData;

      if (req.query.type === "USER") {
        const requests = await Request.find({
          userId: req.user.id,
          status: "PENDING",
        })
          .populate("shopId")
          .sort({
            createdAt: -1,
          });

        requestsData = requests.map((r: any) => ({
          id: r._id,
          text:
            r.type === "START"
              ? `${r.shopId.name} wants to start the service..`
              : `${r.shopId.name} wants to end the service..`,
          status: r.status,
          type: r.type,
          userId: r.userId,
          shopId: r.shopId._id,
          orderId: r.orderId,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      } else if (req.query.type === "SHOP") {
        const requests = await Request.find({
          shopId: req.user.id,
        })
          .populate("userId")
          .sort({
            createdAt: -1,
          });

        requestsData = requests.map((r: any) => ({
          id: r._id,
          text:
            r.type === "START"
              ? `Requested to ${r.userId.name} to start the service..`
              : `Requested to ${r.userId.name} to end the service..`,
          status: r.status,
          type: r.type,
          userId: r.userId._id,
          shopId: r.shopId,
          orderId: r.orderId,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }

      if (!requestsData) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting requests.",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            requestsData,
            "Requests got successfully.",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting requests.",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export { startService, changeStatus, getRequest };
