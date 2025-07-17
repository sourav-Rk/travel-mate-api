import { NextFunction, Request, Response } from "express";

export interface IAuthController {
  signup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshToken(req : Request, res : Response) : Promise<void>;
}
