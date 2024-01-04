import ErrorHandler from "../utils/ErrorHandler";
import {Request,Response,NextFunction}  from 'express'

export const ErrorMiddleware = (err:any,req:Request,res:Response,next:NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server error"
    
    if (err.name === 'CastError') {
        const message = `Resource not found invalid ${err.path}`
        err = new ErrorHandler(message,400)
    }

    // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Your url is invalid please try again letter`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expired
  if (err.name === "TokenExpiredError") {
    const message = `Your Url is expired please try again letter!`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
}