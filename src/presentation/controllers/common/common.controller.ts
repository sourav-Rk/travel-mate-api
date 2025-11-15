import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ImageMulterResponseDto } from "../../../application/dto/response/imageMulterDto";
import { IUploadImageUsecase } from "../../../application/usecase/interfaces/common/upload-image.usecase";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { ICommonController } from "../../interfaces/controllers/common.controller.interface";

export interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

@injectable()
export class CommonController implements ICommonController {
  constructor(
    @inject("IUploadImageUsecase")
    private uploadImageUsecase: IUploadImageUsecase
  ) {}

  async uploadImages(
    req: MulterRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const files: Express.Multer.File[] = req.files;
      const uploadedFiles: ImageMulterResponseDto =
        this.uploadImageUsecase.execute(files);
      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.IMAGE_UPLOADED_SUCCESSFULLY,
        uploadedFiles
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
