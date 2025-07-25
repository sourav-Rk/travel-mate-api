import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ICommonController } from "../../../entities/controllerInterfaces/common.controller.interface";
import { IUploadImageUsecase } from "../../../entities/useCaseInterfaces/common/upload-image.usecase";
import { ImageMulterResponseDto } from "../../../shared/dto/imageMulterDto";
import { HTTP_STATUS } from "../../../shared/constants";

export interface MulterRequest extends Request{
    files : Express.Multer.File[];
}

@injectable()
export class CommonController implements ICommonController{
    constructor(
       @inject('IUploadImageUsecase')
       private uploadImageUsecase : IUploadImageUsecase
    ){}

    async uploadImages(req: MulterRequest, res: Response, next: NextFunction): Promise<void> {
        console.log("in common controller")
        try{
            console.log(req.files,"------files->")
            const files : Express.Multer.File[] = req.files;
            const uploadedFiles : ImageMulterResponseDto = this.uploadImageUsecase.execute(files)
            res.status(HTTP_STATUS.OK).json({success : true,message :"Image uploaded successfully",data:uploadedFiles})
        }catch(error){
           console.log(error);
           next(error);
        }
    }
}