import { Request, Response } from "express";

export interface ILocalGuideController {
  requestVerification(req: Request, res: Response): Promise<void>;
  getPendingVerifications(req: Request, res: Response): Promise<void>;
  verifyGuide(req: Request, res: Response): Promise<void>;
  rejectGuide(req: Request, res: Response): Promise<void>;
  getLocalGuideProfile(req: Request, res: Response): Promise<void>;
  updateAvailability(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  getLocalGuidesByLocation(req: Request, res: Response): Promise<void>;
  getLocalGuidePublicProfile(req: Request, res: Response): Promise<void>;
}

