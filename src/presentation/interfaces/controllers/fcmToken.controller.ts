import { Request, Response } from "express";

export interface IFcmController {
    saveFcmToken(req : Request,res : Response) : Promise<void>;
}