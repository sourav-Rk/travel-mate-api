import { ImageMulterResponseDto } from "../../../shared/dto/imageMulterDto";

export interface IUploadImageUsecase{
    execute(files:Express.Multer.File[]) : ImageMulterResponseDto
}