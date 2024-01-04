import {Response,Request,NextFunction } from "express";

const CatchAsync = (theFunc: any) => (req: Request, res:Response,next:NextFunction) => {
    Promise.resolve(theFunc(req,res,next)).then(next)
}

export default CatchAsync;