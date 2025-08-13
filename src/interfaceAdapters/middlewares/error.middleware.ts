import {NextFunction, Request,Response } from "express";

import { IErrorMiddleware } from "../../entities/middleWareInterfaces/error-middleware.interface";
import { HTTP_STATUS, ERROR_MESSAGE } from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ValidationError } from "../../shared/utils/error/validationError";

export class ErrorMiddleware implements IErrorMiddleware {
    public handleError(err: any, req: Request, res: Response,next : NextFunction): void {
        
    
        let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        let message =  ERROR_MESSAGE.SERVER_ERROR;

        if(err instanceof CustomError){
            statusCode = err.statusCode;
            message = err.message
            if(err instanceof ValidationError){
                message = err.message
            }
        }else if(err instanceof NotFoundError){
            statusCode = err.statusCode;
            message = err.message
        }

        console.error(`statusCode ${statusCode}`,`message ${message}, error : ${err}`);

        res.status(statusCode).json({success : false,message})
    }
}