import {Response,Request,NextFunction } from "express";

const CatchAsyncError = (theFunc: any) => (req: Request, res:Response,next:NextFunction) => {
    Promise.resolve(theFunc(req,res,next)).then(next)
}

export default CatchAsyncError;