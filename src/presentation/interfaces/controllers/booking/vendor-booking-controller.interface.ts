import { Request, Response } from "express";

export interface IVendorBookingController {
  getBookings(req: Request, res: Response): Promise<void>;
  sendPaymentAlert(req: Request, res: Response): Promise<void>;
  getBookingDetails(req: Request, res: Response): Promise<void>;
  verifyBookingCancellation(req : Request,res : Response) : Promise<void>;
  getCancellationRequests(req : Request,res : Response) : Promise<void>;
  getCancelledBookingDetails(req : Request,res : Response) : Promise<void>;
}
