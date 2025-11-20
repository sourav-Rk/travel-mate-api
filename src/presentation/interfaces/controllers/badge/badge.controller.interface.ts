import { Request, Response } from "express";

export interface IBadgeController {
  getAllBadges(req: Request, res: Response): Promise<void>;
  getGuideBadges(req: Request, res: Response): Promise<void>;
  evaluateBadges(req: Request, res: Response): Promise<void>;
}




