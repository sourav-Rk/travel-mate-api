import { container } from "tsyringe";

import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { IPhoneExistenceService } from "../../entities/serviceInterfaces/phone-existence-service.interface";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { EmailService } from "../../interfaceAdapters/services/email.servie";
import { OtpService } from "../../interfaceAdapters/services/otp.service";
import { PhoneExistenceService } from "../../interfaceAdapters/services/phone-existence.service";
import { TokenService } from "../../interfaceAdapters/services/token.service";
import { UserExistenceServive } from "../../interfaceAdapters/services/user-existence.service";
import { IPushNotificationService } from "../../entities/serviceInterfaces/push-notifications.interface";
import { PushNotificationService } from "../../interfaceAdapters/services/push-notification.service";
import { IPaymentService } from "../../entities/serviceInterfaces/payment-service.interface";
import { StripePaymentService } from "../../interfaceAdapters/services/payment.service";
import { stripe } from "../stripe/stripe";
import Stripe from "stripe";

export class ServiceRegistory {
  static registerService(): void {
    container.register<IOtpService>("IOtpService", {
      useClass: OtpService,
    });

    container.register<IEmailService>("IEmailService", {
      useClass: EmailService,
    });

    container.register<ITokenService>("ITokenService", {
      useClass: TokenService,
    });

    container.register<IUserExistenceService>("IUserExistenceService", {
      useClass: UserExistenceServive,
    });

    container.register<IPhoneExistenceService>("IPhoneExistenceService", {
      useClass: PhoneExistenceService,
    });

    container.register<IPushNotificationService>("IPushNotificationService", {
      useClass: PushNotificationService,
    });

    container.register<IPaymentService>('IPaymentService',{
      useClass : StripePaymentService
    });

    container.register<Stripe>('Stripe',{
      useValue : stripe
    })

    container.resolve(EmailService);
  }
}
