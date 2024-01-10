import userModel from "../models/user.model";
import { Response } from "express";
import { redis } from "../utils/redis";
export const getUserById = async (id: string, res: Response) => {
  let user = await redis.get(id);

  if (user) {
    JSON.parse(user);
    res.status(200).json({
      success: true,
      user,
    });
  }
};
