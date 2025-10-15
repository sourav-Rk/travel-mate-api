import { Request, Response } from "express";
export interface IGuideClientController {
  getClientDetailsForGuide(req: Request, res: Response): Promise<void>;
}
