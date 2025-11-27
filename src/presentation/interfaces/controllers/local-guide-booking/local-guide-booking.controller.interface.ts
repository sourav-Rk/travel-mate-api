import { Request, Response } from "express";

export interface ILocalGuideBookingController {
  createQuote(req: Request, res: Response): Promise<void>;
  getPendingQuotes(req: Request, res: Response): Promise<void>;
  acceptQuote(req: Request, res: Response): Promise<void>;
  declineQuote(req: Request, res: Response): Promise<void>;
  payAdvanceAmount(req: Request, res: Response): Promise<void>;
  payFullAmount(req: Request, res: Response): Promise<void>;
  getLocalGuideBookings(req: Request, res: Response): Promise<void>;
  getLocalGuideBookingsForGuide(req: Request, res: Response): Promise<void>;
  getLocalGuideBookingDetails(req: Request, res: Response): Promise<void>;
  markServiceComplete(req: Request, res: Response): Promise<void>;
}












