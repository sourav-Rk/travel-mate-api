import { Request, Response } from "express";

export interface IWishlistController {
  getWishlist(req: Request, res: Response): Promise<void>;
  addToWishlist(req: Request, res: Response): Promise<void>;
  removeFromWishlist(req: Request, res: Response): Promise<void>;
}
