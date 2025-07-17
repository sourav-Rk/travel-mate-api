import { inject, injectable } from "tsyringe";
import { IVerifyExistingEmail } from "../../entities/useCaseInterfaces/auth/verify-existing-email-usecase.interface";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, EVENT_EMMITER_TYPE, HTTP_STATUS, MAIL_CONTENT_PURPOSE } from "../../shared/constants";
import { eventBus } from "../../shared/eventBus";
import { mailContentProvider } from "../../shared/mailContentProvider";

@injectable()
export class VerifyExistingEmail implements IVerifyExistingEmail{
    constructor(
        @inject('IEmailService')
        private emailService : IEmailService,

        @inject('IOtpService')
        private otpService : IOtpService,

        @inject('IUserExistenceService')
        private userExistenceService : IUserExistenceService
    ){}

    async execute(email: string): Promise<void> {
        const emailExists = await this.userExistenceService.emailExists(email);

        if(!emailExists){
            throw new CustomError(HTTP_STATUS.NOT_FOUND,ERROR_MESSAGE.EMAIL_NOT_FOUND)
        }

        const otp = this.otpService.generateOtp();
        await this.otpService.storeOtp(email,otp);
        const html = mailContentProvider(MAIL_CONTENT_PURPOSE.OTP,otp)
        eventBus.emit(EVENT_EMMITER_TYPE.SENDMAIL,email,"Account creation",html)
    }
}