import { Request, Response } from "express";

export interface IKycController {
     addKyc(req: Request, res: Response): Promise<void>;
}