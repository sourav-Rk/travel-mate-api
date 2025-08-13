import {inject,injectable} from 'tsyringe';

import { IOtpService } from '../../entities/serviceInterfaces/otp-service.interface';
import { IVerifyOtpUsecase } from '../../entities/useCaseInterfaces/auth/verifyOtpUsecase';
import { HTTP_STATUS } from '../../shared/constants';
import { ValidationError } from '../../shared/utils/error/validationError';
import { ISuccessResponseHandler, successResponseHandler } from '../../shared/utils/successResponseHandler';


@injectable()
export class VerifyOtpUsecase implements IVerifyOtpUsecase{
    constructor(
        @inject('IOtpService')
        private _IOtpService : IOtpService,

    ){}

    async execute(email : string,otp:string) : Promise<ISuccessResponseHandler>{
        const isOtpValid = await this._IOtpService.verifyOtp({email,otp});

        if(!isOtpValid){
            throw new ValidationError("invalid otp")
        }
        
        return successResponseHandler(true,HTTP_STATUS.OK,"Otp verified successfully");
    }
}