import jwt from "express-jwt";
import { Application } from "express-serve-static-core";
import { jwt_secret } from "../config/config";
// import user from "./user";

export const setup = (app: Application) => {
  app.use(
    "/api/v1",
    jwt({
      secret: jwt_secret,
      algorithms: ["HS256"],
    }).unless({
      path: ["/api/v1/user/register", "/api/v1/user/login"],
    })
  );

  // app.use("/api/v1/user", user);
};
