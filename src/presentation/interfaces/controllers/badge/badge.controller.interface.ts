import { Request, Response } from "express";

export interface IBadgeController {
  getAllBadges(req: Request, res: Response): Promise<void>;
  getGuideBadges(req: Request, res: Response): Promise<void>;
  evaluateBadges(req: Request, res: Response): Promise<void>;
  // Admin methods
  createBadge(req: Request, res: Response): Promise<void>;
  updateBadge(req: Request, res: Response): Promise<void>;
  deleteBadge(req: Request, res: Response): Promise<void>;
  getBadgeById(req: Request, res: Response): Promise<void>;
}






