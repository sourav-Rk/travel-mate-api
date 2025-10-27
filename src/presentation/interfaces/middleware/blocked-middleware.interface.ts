import { Request, Response, NextFunction } from "express";

export interface IBlockedMiddleware {
  checkBlockedStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
