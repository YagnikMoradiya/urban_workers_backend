import { Request, Response } from "express";
import httpStatus from "http-status";
import { Category } from "../models";
import APIResponse from "../utils/APIResponse";

const getCategory = {
    controller: async (req:Request, res: Response) => {
        try {
            const categories = await Category.find();
            
            if(!categories) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, "Error to get categories", httpStatus.INTERNAL_SERVER_ERROR));
            }

            return res.status(httpStatus.OK).json(new APIResponse(categories, "Categories Found", httpStatus.OK))
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, "Error to get categories", httpStatus.INTERNAL_SERVER_ERROR, error))
        }
    }
}

export { getCategory };