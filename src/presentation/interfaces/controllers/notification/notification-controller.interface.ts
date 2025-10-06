import { Request, Response } from "express";

export interface INotificationController {
    getNotifications(req : Request,res : Response) : Promise<void>;
    markReadNotification(req : Request,res : Response) : Promise<void>;
    markAsReadAllNotification(req : Request,res : Response) : Promise<void>;
}