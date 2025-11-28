import { Request, Response } from "express";

export interface IGuideProfileController {
    getGuideProfile(req : Request, res : Response) : Promise<void>;
    updatePassword(req : Request,res:Response) : Promise<void>; 
    getGuideDetailsForClient(req : Request,res : Response) : Promise<void>;
    updateProfile(req : Request,res : Response) : Promise<void>;
}