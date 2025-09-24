import { Request, Response } from "express";

export interface IGuidePackageController {
    getAssignedPackages(req : Request,res : Response) : Promise<void>;
    getPackageDetails(req : Request,res : Response) : Promise<void>;
    updatePackageStatus(req : Request,res : Response) : Promise<void>;
}