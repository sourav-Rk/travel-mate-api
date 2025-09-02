import { Request, Response } from "express";

export interface IClientBookingController {
    applyPackage(req : Request,res : Response) : Promise<void>;
    getBookingDetailOfPackage(req : Request,res : Response) : Promise<void>;
    getBookings(req : Request, res : Response) : Promise<void>;
}