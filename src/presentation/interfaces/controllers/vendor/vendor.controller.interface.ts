import { Request, Response } from "express";

export interface IVendorController {
  getDetailsforStatus(req: Request, res: Response): Promise<void>
  updateVendorStatus(req: Request, res: Response): Promise<void>;
  getDashboardStats(req: Request, res: Response): Promise<void>;
}
