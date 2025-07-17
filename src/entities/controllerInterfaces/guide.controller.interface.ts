import { Request, Response } from "express";

export interface IGuideController {
    resetPassword(req : Request, res : Response) : Promise<void>
}