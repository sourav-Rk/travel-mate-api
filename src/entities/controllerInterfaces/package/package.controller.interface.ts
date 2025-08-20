import { Request, Response } from "express";

export interface IPackageController {
  addPackage(req: Request, res: Response): Promise<void>;
  getPackages(req: Request, res: Response): Promise<void>;
  getPackageDetails(req: Request, res: Response): Promise<void>;
  updatePackage(req: Request, res: Response): Promise<void>;
}
