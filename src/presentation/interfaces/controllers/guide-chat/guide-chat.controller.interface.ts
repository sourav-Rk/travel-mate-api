import { Request, Response } from "express";

export interface IGuideChatController {
  createRoom(req: Request, res: Response): Promise<void>;
  getRooms(req: Request, res: Response): Promise<void>;
  getMessages(req: Request, res: Response): Promise<void>;
  getBookingByChatRoom(req: Request, res: Response): Promise<void>;
}


