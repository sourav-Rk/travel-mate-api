import { Request,Response,NextFunction } from "express";

export interface IErrorMiddleware{
    handleError(err : any, req : Request, res : Response,next : NextFunction) : void;
}