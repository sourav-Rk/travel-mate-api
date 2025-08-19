import { Request, Response } from "express";

export interface IItineraryController {
    updateItinerary(req : Request,res : Response) : Promise<void>;
}