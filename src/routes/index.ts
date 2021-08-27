import jwt from "express-jwt";
import { Application } from "express-serve-static-core";
import { jwt_secret } from "../config/config";
import user from "./user";
import shop from "./shop";

export const setup = (app: Application) => {
  app.use(
    "/api/v1",
    jwt({
      secret: jwt_secret,
      algorithms: ["HS256"],
    }).unless({
      path: [
        "/api/v1/user/register",
        "/api/v1/user/login",
        "/api/v1/user/send-otp",
        "/api/v1/user/forgot-password",
        "/api/v1/shop/register",
        "/api/v1/shop/login",
      ],
    })
  );

  app.use("/api/v1/user", user);
  app.use("/api/v1/shop", shop);
};
