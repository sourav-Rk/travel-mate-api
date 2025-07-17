import { container } from "tsyringe";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { OtpService } from "../../interfaceAdapters/services/otp.service";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { EmailService } from "../../interfaceAdapters/services/email.servie";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { TokenService } from "../../interfaceAdapters/services/token.service";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { UserExistenceServive } from "../../interfaceAdapters/services/user-existence.service";
import { IPhoneExistenceService } from "../../entities/serviceInterfaces/phone-existence-service.interface";
import { PhoneExistenceService } from "../../interfaceAdapters/services/phone-existence.service";

export class ServiceRegistory{
    static registerService() : void {
      container.register<IOtpService>('IOtpService',{
        useClass : OtpService
      })

      container.register<IEmailService>('IEmailService',{
        useClass : EmailService
      })

      container.register<ITokenService>('ITokenService',{
        useClass : TokenService
      })

       
      container.register<IUserExistenceService>('IUserExistenceService',{
        useClass : UserExistenceServive
      })

      container.register<IPhoneExistenceService>('IPhoneExistenceService',{
        useClass : PhoneExistenceService
      })

       container.resolve(EmailService);
    }   
}