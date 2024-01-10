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
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
} from "../controllers/user.controller";
const userRouter = Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticate, logOutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticate, getUserInfo);
userRouter.post("/social-auth", SocialAuth);
userRouter.put("/update-user-info", isAuthenticate, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticate, updatePassword);
userRouter.put("/update-user-avatar", isAuthenticate, updateProfilePicture);

export default userRouter;
