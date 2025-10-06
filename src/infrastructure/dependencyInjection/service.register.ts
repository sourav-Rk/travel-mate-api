import { container } from "tsyringe";

import { IEmailService } from "../../domain/service-interfaces/email-service.interface";
import { IOtpService } from "../../domain/service-interfaces/otp-service.interface";
import { IPhoneExistenceService } from "../../domain/service-interfaces/phone-existence-service.interface";
import { ITokenService } from "../../domain/service-interfaces/token-service.interface";
import { IUserExistenceService } from "../../domain/service-interfaces/user-existence-service.interface";
import { EmailService } from "../service/email.servie";
import { OtpService } from "../service/otp.service";
import { PhoneExistenceService } from "../service/phone-existence.service";
import { TokenService } from "../service/token.service";
import { UserExistenceServive } from "../service/user-existence.service";
import { IPushNotificationService } from "../../domain/service-interfaces/push-notifications.interface";
import { PushNotificationService } from "../service/push-notification.service";
import { IPaymentService } from "../../domain/service-interfaces/payment-service.interface";
import { StripePaymentService } from "../service/payment.service";
import { stripe } from "../config/stripe/stripe.confige";
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

    container.register<IPaymentService>("IPaymentService", {
      useClass: StripePaymentService,
    });

    container.register<Stripe>("Stripe", {
      useValue: stripe,
    });

    container.resolve(EmailService);
  }
}
