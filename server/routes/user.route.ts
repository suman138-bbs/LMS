import express, { Router } from "express";

import { isAuthenticate } from "../middlewares/auth";

import {
  activateUser,
  registrationUser,
  loginUser,
  logOutUser,
} from "../controllers/user.controller";
const userRouter = Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticate, logOutUser);

export default userRouter;
