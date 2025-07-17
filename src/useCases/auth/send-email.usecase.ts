import { inject, injectable } from "tsyringe";
import { ISendEmailUsecase } from "../../entities/useCaseInterfaces/auth/send-email-usecase.interface";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { CustomError } from "../../shared/utils/error/customError";
import { EmailOtpPurpose, ERROR_MESSAGE, EVENT_EMMITER_TYPE, HTTP_STATUS, MAIL_CONTENT_PURPOSE } from "../../shared/constants";
import { eventBus } from "../../shared/eventBus";
import { mailContentProvider } from "../../shared/mailContentProvider";
import { IPhoneExistenceService } from "../../entities/serviceInterfaces/phone-existence-service.interface";

@injectable()
export class SendEmailUsecase implements ISendEmailUsecase{
    constructor(

        @inject('IOtpService')
        private otpService : IOtpService,
        
        @inject('IUserExistenceService')
        private userExistenceService : IUserExistenceService,

        @inject('IPhoneExistenceService')
        private phoneExistenceService : IPhoneExistenceService
    ){}
    
    async execute(email : string,phone : string,formData : any, purpose : EmailOtpPurpose) : Promise<void>{
        const emailExists =  await this.userExistenceService.emailExists(email);
        if(emailExists){
            throw new CustomError(HTTP_STATUS.CONFLICT,ERROR_MESSAGE.EMAIL_EXISTS)
        }

        const phoneExists = await this.phoneExistenceService.phoneExists(phone);

        if(phoneExists){
            throw new CustomError(HTTP_STATUS.CONFLICT,ERROR_MESSAGE.PHONE_NUMBER_EXISTS);
        }

        await this.otpService.deleteOtp(email);
        

        const otp = this.otpService.generateOtp();

        console.log(otp)

        await this.otpService.storeOtp(email,otp);

        if(purpose ==="signup" && formData){
            await this.otpService.storeFormData(formData)
        }

        const html = mailContentProvider(MAIL_CONTENT_PURPOSE.OTP,otp)
        
        eventBus.emit(EVENT_EMMITER_TYPE.SENDMAIL,email,"Account creation",html)
    }

}