import { Request, Response } from "express";

export interface IAddressController {
    updateAddress(req : Request,res : Response) : Promise<void>;
    addAddress(req: Request, res: Response): Promise<void> 
}