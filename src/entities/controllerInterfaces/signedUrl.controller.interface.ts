import { NextFunction, Request, Response } from "express";

export interface ISignedUrlController {
   generateSignedUrl(req : Request,res:Response,next:NextFunction) : Promise<void>
}