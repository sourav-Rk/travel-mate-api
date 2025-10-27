import { injectable } from "tsyringe";

import { ImageMulterResponseDto } from "../../../dto/response/imageMulterDto";
import { IUploadImageUsecase } from "../../interfaces/common/upload-image.usecase";

@injectable()
export class UploadImageUsecase implements IUploadImageUsecase {
  execute(files: Express.Multer.File[]): ImageMulterResponseDto {
    return files.map((file: Express.Multer.File) => ({
      url: file.path,
      public_id: file.filename,
    }));
  }
}
