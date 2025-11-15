import { Request, Response } from "express";

export interface IPaymentController {
    payAdvanceAmount(req : Request,res : Response) : Promise<void>;
    payFullAmount(req : Request,res : Response) : Promise<void>;
    handleWebhook(req : Request,res : Response) : Promise<void>;
}