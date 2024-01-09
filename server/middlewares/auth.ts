import { Request, Response, NextFunction } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";

import CatchAsyncError from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";

interface MyJwtPayload extends JwtPayload {
  id: string;
}

export const isAuthenticate = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    const decoded = Jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Invalid Acess token", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return new ErrorHandler("User not found", 400);
    }

    req.user = JSON.parse(user);
    next();
  }
);

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Roles: ${req.user?.role} is not allowed to access this resource`,
          400
        )
      );
    }
    next();
  };
};
