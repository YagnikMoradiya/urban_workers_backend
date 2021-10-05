import { celebrate, Joi } from "celebrate";
import { Response } from "express";
import httpStatus from "http-status";
import { calculateMinute } from "../utils/utils";
import { Order } from "../models";
import APIResponse from "../utils/APIResponse";
import { OrderType, RoleType } from "../utils/constant";
import moment from "moment";

const createOrder = {
  validator: celebrate({
    body: Joi.object().keys({
      category: Joi.string().required(),
      status: Joi.string().valid(
        OrderType.pending,
        OrderType.ongoing,
        OrderType.completed
      ),
      date: Joi.string().required(),
      perHour: Joi.number().required(),
      serviceId: Joi.string().required(),
      addressId: Joi.string().required(),
      workerId: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      if (req.user.role !== RoleType.user) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(
            new APIResponse(
              null,
              "You can not creat Order || You are unauthorized 💩💩",
              httpStatus.UNAUTHORIZED
            )
          );
      }

      const orderDataObj = {
        category: req.body.category,
        status: req.body.status,
        date: req.body.date,
        perHour: req.body.perHour,
        serviceId: req.body.serviceId,
        addressId: req.body.addressId,
        workerId: req.body.workerId,
        userId: req.user.id,
      };

      const order = new Order(orderDataObj);

      const orderData = await order.save();

      if (!orderData) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in creating Orders",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            orderData,
            "Orders created successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in creating Orders",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const getOrders = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const orders = await Order.find({
        userId: req.user.id,
        status: {
          $ne: OrderType.deleted,
        },
      }).sort({
        date: -1,
      });

      if (!orders) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in getting Orders",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(orders, "Orders created successfully", httpStatus.OK)
        );

      console.log(orders);
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in getting Orders",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const changeStatus = {
  validator: celebrate({
    params: Joi.object().keys({
      orderId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      status: Joi.string()
        .allow(OrderType.ongoing, OrderType.completed, OrderType.deleted)
        .required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: req.params.orderId,
          status: { $ne: OrderType.deleted },
        },
        {
          status: req.body.status,
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in updating status || Can't change status of deleted order",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(null, "Status updated successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in updating status",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const addStartTime = {
  validator: celebrate({
    params: Joi.object().keys({
      orderId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      startTime: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: req.params.orderId,
          status: { $ne: OrderType.deleted },
        },
        {
          startTime: req.body.startTime,
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in updating startTime || Can't change startTime of deleted order",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(null, "StartTime updated successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in updating startTime",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const addEndTime = {
  validator: celebrate({
    params: Joi.object().keys({
      orderId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      endTime: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const order = await Order.findOne({
        _id: req.params.orderId,
        status: { $ne: OrderType.deleted },
      });

      if (!order.startTime) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Please add first startTime",
              httpStatus.BAD_REQUEST
            )
          );
      }

      let body = {
        endTime: req.body.endTime,
        totalCharge:
          (order.perHour / 60) *
          calculateMinute(order.startTime, parseInt(req.body.endTime)),
        status: OrderType.completed,
      };

      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: req.params.orderId,
          status: { $ne: OrderType.deleted },
        },
        {
          ...body,
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Error in updating status || Can't change status of deleted order",
              httpStatus.BAD_REQUEST
            )
          );
      }

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(null, "Status updated successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in updating status",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

export { createOrder, getOrders, changeStatus, addStartTime, addEndTime };
