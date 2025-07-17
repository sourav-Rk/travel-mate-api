import { NextFunction, Response } from "express";
import { MulterRequest } from "../../interfaceAdapters/controllers/common/common.controller";

export interface ICommonController {
    uploadImages(req : MulterRequest,res : Response,next : NextFunction) : Promise<void>;
}