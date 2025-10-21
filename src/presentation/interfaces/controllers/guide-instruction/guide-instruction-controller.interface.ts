import { Request, Response } from "express";

export interface IGuideInstructionController {
  createInstruction(req: Request, res: Response): Promise<void>;
  getInstructionsClient(req : Request,res : Response) : Promise<void>;
  markInstructionRead(req : Request,res : Response) : Promise<void>;
  markAllInstructionsRead(req : Request,res : Response) : Promise<void>;
}
