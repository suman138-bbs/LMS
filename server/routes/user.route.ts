import express, { Router } from "express";

import { registrationUser } from "../controllers/user.controller";
const userRouter = Router();

userRouter.post("/registration", registrationUser);

export default userRouter;
