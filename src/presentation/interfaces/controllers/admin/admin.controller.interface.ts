import { Request, Response } from "express";

export interface IAdminController {
  getAllUsers(req: Request, res: Response): Promise<void>;
  updateUserStatus(req: Request, res: Response): Promise<void>;
  getUserDetails(req: Request, res: Response): Promise<void>;
  updateVendorStatus(req: Request, res: Response): Promise<void>;
}
