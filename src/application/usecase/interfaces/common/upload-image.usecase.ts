import { ImageMulterResponseDto } from "../../../dto/response/imageMulterDto";

export interface IUploadImageUsecase {
  execute(files: Express.Multer.File[]): ImageMulterResponseDto;
}
