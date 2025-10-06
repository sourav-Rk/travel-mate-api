import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ISignedUrlController } from "../../interfaces/controllers/signedUrl.controller.interface";
import { IGenerateSignedUrlUsecase } from "../../../application/usecase/interfaces/common/generate-signedurl-usecase.interface";
import { HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class SignedUrlController implements ISignedUrlController {
  constructor(
    @inject("IGenerateSignedUrlUsecase")
    private _generateSignedUrlUsecase: IGenerateSignedUrlUsecase
  ) {}

  async generateSignedUrl(req: Request, res: Response): Promise<void> {
    const { data, expiresIn = 300 } = req.body;
    let publicIds: string[];
    if (typeof data === "string") {
      publicIds = [data];
    } else if (Array.isArray(data)) {
      publicIds = data;
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Data must be a string or array of strings",
      });
      return;
    }
    const response = await this._generateSignedUrlUsecase.executeMultiple(
      publicIds,
      expiresIn
    );
    res.status(HTTP_STATUS.OK).json({ success: true, urls: response });
  }
}
