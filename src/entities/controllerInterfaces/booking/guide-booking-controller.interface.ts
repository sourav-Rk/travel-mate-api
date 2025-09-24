import { Request, Response } from "express";

export interface IGuideBookingController {
    getBookingsOfThePackage(req : Request,res : Response) : Promise<void>;
    getBookingDetailsGuide(req : Request,res : Response) : Promise<void>;
}