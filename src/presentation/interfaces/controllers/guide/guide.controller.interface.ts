import { Request, Response } from "express";

export interface IGuideController {
    resetPassword(req : Request, res : Response) : Promise<void>;
    addGuide(req: Request, res: Response): Promise<void>
    getAllGuides(req : Request,res:Response) : Promise<void>;
    getGuideDetails(req : Request,res : Response) : Promise<void>;
}