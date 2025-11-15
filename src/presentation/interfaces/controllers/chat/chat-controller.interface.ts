import { Request, Response } from "express";


export interface IChatController {
  getMessages(req: Request, res: Response): Promise<void>;
  getChatHistory(req: Request, res: Response): Promise<void>;
  getChatroom(req: Request, res: Response): Promise<void>;
}
