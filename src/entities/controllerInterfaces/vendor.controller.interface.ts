import { Request, Response } from "express";

export interface IVendorController {
  addGuide(req: Request, res: Response): Promise<void>;
  getDetails(req: Request, res: Response): Promise<void>;
  updateVendorStatus(req: Request, res: Response): Promise<void>;
  addAddress(req: Request, res: Response): Promise<void>;
  addKyc(req: Request, res: Response): Promise<void>;
}
