import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";

import userModel, { Iuser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CatchAsyncError from "../middlewares/catchAsyncError";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";

/**Registration */

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, avatar } = req.body as IRegistrationBody;
    try {
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already Exist", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationtoken = createActivationToken(user);
      const activationcode = activationtoken.activationCode;
      const data = { user: { name: user.name }, activationcode };
      const html = await ejs.renderFile(
        path.join(__dirname, "..", "mails", "activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your accout",
          template: "activation-mail.ejs",
          data,
        });
        res.status(200).json({
          success: true,
          message: `Check your email ${user.email} to activate your account`,
          activationtoken: activationtoken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 404));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IactivationToken {
  token: string;
  activationCode: string;
}

const createActivationToken = (user: any): IactivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );
  return { token, activationCode };
};

/**Activate user */

interface IactivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IactivationRequest;

      const newUser: { user: Iuser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: Iuser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;
      const user = await userModel.create({
        name,
        email,
        password,
      });
      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**Login user */

interface ILoginUser {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginUser;
      if (!email && !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
      }
      const isPasswordMatch = user?.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Incorrect Password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {}
  }
);

/**Logout User */

export const logOutUser = CatchAsyncError(
  (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      res.status(200).json({ success: true, message: "Logged successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
