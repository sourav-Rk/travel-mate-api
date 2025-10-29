import Stripe from "stripe";
import { container } from "tsyringe";

import { IAdminPaymentService } from "../../domain/service-interfaces/admin-payment-service.interface";
import { IEmailService } from "../../domain/service-interfaces/email-service.interface";
import { IOtpService } from "../../domain/service-interfaces/otp-service.interface";
import { IPaymentService } from "../../domain/service-interfaces/payment-service.interface";
import { IPhoneExistenceService } from "../../domain/service-interfaces/phone-existence-service.interface";
import { IPushNotificationService } from "../../domain/service-interfaces/push-notifications.interface";
import { IRevenueDistributionService } from "../../domain/service-interfaces/revenue-distribution-service.interface";
import { ITokenService } from "../../domain/service-interfaces/token-service.interface";
import { IUserExistenceService } from "../../domain/service-interfaces/user-existence-service.interface";
import { IVendorPaymentService } from "../../domain/service-interfaces/vendor-payment-service.interface";
import { stripe } from "../config/stripe/stripe.confige";
import { AdminPaymentService } from "../service/admin-payment.service";
import { EmailService } from "../service/email.servie";
import { OtpService } from "../service/otp.service";
import { StripePaymentService } from "../service/payment.service";
import { PhoneExistenceService } from "../service/phone-existence.service";
import { PushNotificationService } from "../service/push-notification.service";
import { RevenueDistributionService } from "../service/revenue-distribution.service";
import { TokenService } from "../service/token.service";
import { UserExistenceServive } from "../service/user-existence.service";
import { VendorPaymentService } from "../service/vendor-payment.service";
import { RealTimeNotificationService } from "../service/real-time-notification.service";
import { IRealTimeNotificationService } from "../../domain/service-interfaces/real-time-notification-service.interface";

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

    container.register<IRevenueDistributionService>(
      "IRevenueDistributionService",
      {
        useClass: RevenueDistributionService,
      }
    );

    container.register<IVendorPaymentService>("IVendorPaymentService", {
      useClass: VendorPaymentService,
    });

    container.register<IAdminPaymentService>("IAdminPaymentService", {
      useClass: AdminPaymentService,
    });

    // container.register<ISocketService>("ISocketService", {
    //   useClass: SocketService,
    // });

    container.registerSingleton<IRealTimeNotificationService>(
      "IRealTimeNotificationService",
      RealTimeNotificationService
    );
    container.resolve(EmailService);
  }
}
