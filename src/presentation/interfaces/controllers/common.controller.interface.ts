import { NextFunction, Response } from "express";

import { MulterRequest } from "../../controllers/common/common.controller";

export interface ICommonController {
  uploadImages(
    req: MulterRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
