import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGenerateSignedUrlUsecase } from "../../../application/usecase/interfaces/common/generate-signedurl-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import { ISignedUrlController } from "../../interfaces/controllers/signedUrl.controller.interface";

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
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.DATA_MUST_BE_STRING_OR_ARARY_OF_STRINGS
      );
      return;
    }
    const response = await this._generateSignedUrlUsecase.executeMultiple(
      publicIds,
      expiresIn
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      response,
      "urls"
    );
  }
}
