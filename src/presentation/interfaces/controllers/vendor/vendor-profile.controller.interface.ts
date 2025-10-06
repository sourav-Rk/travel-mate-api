import { Request, Response } from "express";

export interface IVendorProfileController {
  getVendorDetails(req: Request, res: Response): Promise<void>;
  updateVendorProfile(req: Request, res: Response): Promise<void>;
  updatePassword(req: Request, res: Response): Promise<void>;
}
