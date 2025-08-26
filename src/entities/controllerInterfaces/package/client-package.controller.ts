import { Request, Response } from "express";

export interface IClientPackageController {
    getAvailablePackages(req : Request,res : Response) : Promise<void>;
    getPackageDetails(req : Request,res : Response) : Promise<void>;
    getFeaturedPackages(req : Request,res : Response) : Promise<void>;
    getTrendingPackages(req : Request,res : Response) : Promise<void>;
}