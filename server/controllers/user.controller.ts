import { Request, Response, NextFunction } from "express"; 
import jwt, { Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';


import userModel, { Iuser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CatchAsyncError from "../middlewares/catchAsyncError";

interface IRegistrationBody{
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, avatar } = req.body as IRegistrationBody
    try {
        const isEmailExist = await userModel.find({ email })
        if (isEmailExist) {
            return next(new ErrorHandler("Email already Exist",400))
        }

        const user: IRegistrationBody = {
            name,
            email,password
        }

        const activationtoken = createActivationToken(user);
        const activationcode = activationtoken.activationCode;
        const data = { user: { name: user.name }, activationcode };
        const html = await ejs.renderFile(path.join(__dirname,"..","mails","activation-mail.ejs"))
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
}) 

interface IactivationToken{
    token: string;
    activationCode: string;
}

const createActivationToken = (user: any):IactivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, {expiresIn: "5m" } )
    return {token,activationCode}
}   