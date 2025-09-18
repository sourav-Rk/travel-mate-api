import { Request, Response } from "express";

export interface IReviewController{
    getReviews(req : Request,res : Response) : Promise<void>;
    addReview(req : Request,res : Response) : Promise<void>;
}