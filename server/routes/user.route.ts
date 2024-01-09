import express, { Router } from "express";

import { isAuthenticate } from "../middlewares/auth";

import {
  activateUser,
  registrationUser,
  loginUser,
  logOutUser,
  updateAccessToken,
  getUserInfo,
  SocialAuth,
} from "../controllers/user.controller";
const userRouter = Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticate, logOutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticate, getUserInfo);
userRouter.post("/social-auth", SocialAuth);

export default userRouter;
