import { Request, Response } from "express";

export interface IClientProfileController {
  getClientDetails(req: Request, res: Response): Promise<void>;
  updateClientProfile(req: Request, res: Response): Promise<void>;
  updatePassword(req: Request, res: Response): Promise<void>;
  getClientDetailsVendor(req: Request, res: Response): Promise<void>;
}
