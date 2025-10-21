import { Request, Response } from "express";

export interface IWalletController {
  getWalletTransactions(req: Request, res: Response): Promise<void>;
  getWalletById(req: Request, res: Response): Promise<void>;
  getWalletByUserId(req: Request, res: Response): Promise<void>;
}
