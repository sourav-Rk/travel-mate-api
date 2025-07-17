import { injectable } from "tsyringe";
import { IUploadImageUsecase } from "../../entities/useCaseInterfaces/common/upload-image.usecase";
import { ImageMulterResponseDto } from "../../shared/dto/imageMulterDto";

@injectable()
export class UploadImageUsecase implements IUploadImageUsecase{

     execute(files:Express.Multer.File[]):ImageMulterResponseDto{
        console.log("in image upload usecase")
        return files.map((file:any)=>({
            url:file.path,
            public_id:file.filename,
            }));
    }
}