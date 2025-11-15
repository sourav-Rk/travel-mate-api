import { Request, Response } from "express";

export interface IGroupChatController {
  getGroups(req: Request, res: Response): Promise<void>;
  getGroupDetails(req : Request,res:Response):Promise<void>;
}
