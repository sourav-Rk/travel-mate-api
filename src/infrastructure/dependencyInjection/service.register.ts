import Stripe from "stripe";
import { container } from "tsyringe";

import { AdminPaymentService } from "../../application/services/implementations/admin-payment.service";
import { LocalGuidePaymentService } from "../../application/services/implementations/local-guide-payment.service";
import { OtpService } from "../../application/services/implementations/otp.service";
import { PhoneExistenceService } from "../../application/services/implementations/phone-existence.service";
import { RevenueDistributionService } from "../../application/services/implementations/revenue-distribution.service";
import { UserExistenceServive } from "../../application/services/implementations/user-existence.service";
import { VendorPaymentService } from "../../application/services/implementations/vendor-payment.service";
import { IAdminPaymentService } from "../../application/services/interfaces/admin-payment-service.interface";
import { ILocalGuidePaymentService } from "../../application/services/interfaces/local-guide-payment-service.interface";
import { IOtpService } from "../../application/services/interfaces/otp-service.interface";
import { IPhoneExistenceService } from "../../application/services/interfaces/phone-existence-service.interface";
import { IRevenueDistributionService } from "../../application/services/interfaces/revenue-distribution-service.interface";
import { IUserExistenceService } from "../../application/services/interfaces/user-existence-service.interface";
import { IVendorPaymentService } from "../../application/services/interfaces/vendor-payment-service.interface";
import { IEmailService } from "../../domain/service-interfaces/email-service.interface";
import { IPaymentService } from "../../domain/service-interfaces/payment-service.interface";
import { IPushNotificationService } from "../../domain/service-interfaces/push-notifications.interface";
import { IRealTimeNotificationService } from "../../domain/service-interfaces/real-time-notification-service.interface";
import { ITokenService } from "../../domain/service-interfaces/token-service.interface";
import { stripe } from "../config/stripe/stripe.confige";
import { BadgeEvaluationHandlerService } from "../service/badge-evaluation-handler.service";
import { EmailService } from "../service/email.servie";
import { StripePaymentService } from "../service/payment.service";
import { PushNotificationService } from "../service/push-notification.service";
import { RealTimeNotificationService } from "../service/real-time-notification.service";
import { TokenService } from "../service/token.service";

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

    container.register<ILocalGuidePaymentService>(
      "ILocalGuidePaymentService",
      {
        useClass: LocalGuidePaymentService,
      }
    );

    // container.register<ISocketService>("ISocketService", {
    //   useClass: SocketService,
    // });

    container.registerSingleton<IRealTimeNotificationService>(
      "IRealTimeNotificationService",
      RealTimeNotificationService
    );

    // Register BadgeEvaluationHandlerService as singleton (similar to EmailService)
    // This ensures the event listener is registered on app startup
    container.resolve(BadgeEvaluationHandlerService);

    container.resolve(EmailService);
  }
}
