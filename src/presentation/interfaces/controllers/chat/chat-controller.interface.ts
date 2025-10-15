import { Request, Response } from "express";
import { IChatRoomEntity } from "../../../../domain/entities/chatroom.entity";

export interface IChatController {
  getMessages(req: Request, res: Response): Promise<void>;
  getChatHistory(req: Request, res: Response): Promise<void>;
  getChatroom(req: Request, res: Response): Promise<void>;
}
