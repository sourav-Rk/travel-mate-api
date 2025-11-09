import { container } from "tsyringe";

import { ILogger } from "../../domain/service-interfaces/logger.interface";
import { ActivityController } from "../../presentation/controllers/activity/activity.controller";
import { AddressController } from "../../presentation/controllers/address/address.controller";
import { AdminController } from "../../presentation/controllers/admin/admin.controller";
import { AuthController } from "../../presentation/controllers/auth/auth.controller";
import { ClientBookingController } from "../../presentation/controllers/booking/client-booking-controller";
import { GuideBookingController } from "../../presentation/controllers/booking/guide-booking-controller";
import { VendorBookingController } from "../../presentation/controllers/booking/vendor-booking-controller";
import { ChatController } from "../../presentation/controllers/chat/chat.controller";
import { ClientProfileController } from "../../presentation/controllers/client/clientProfile.controller";
import { GuideClientController } from "../../presentation/controllers/client/guideClient.controller";
import { CommonController } from "../../presentation/controllers/common/common.controller";
import { FcmTokencontroller } from "../../presentation/controllers/common/fcmToken.controller";
import { GroupChatController } from "../../presentation/controllers/group-chat/group-chat.controller";
import { GuideController } from "../../presentation/controllers/guide/guide.controller";
import { GuideProfileController } from "../../presentation/controllers/guide/guideProfileController";
import { GuideInstructionController } from "../../presentation/controllers/guide-instruction/guide-instruction.controller";
import { ItineraryController } from "../../presentation/controllers/itinerary/itinerary.controller";
import { KycController } from "../../presentation/controllers/kyc/kycController";
import { SignedUrlController } from "../../presentation/controllers/media/signedUrl.controller";
import { NotificationController } from "../../presentation/controllers/notification/notification.controller";
import { ClientPackageController } from "../../presentation/controllers/package/client-package-controller.interface";
import { GuidePackageController } from "../../presentation/controllers/package/guide-package-controller";
import { PackageController } from "../../presentation/controllers/package/package.controller";
import { PaymentController } from "../../presentation/controllers/payment/payment.controller";
import { ReviewController } from "../../presentation/controllers/review/review.controller";
import { VendorController } from "../../presentation/controllers/vendor/vendor.controller";
import { VendorSalesReportController } from "../../presentation/controllers/vendor/vendor-sales-report.controller";
import { VendorProfileController } from "../../presentation/controllers/vendor/vendor.profile.controller";
import { WalletController } from "../../presentation/controllers/wallet/wallet.controller";
import { WishlistController } from "../../presentation/controllers/wishlist/wishlist.controller";
import { IActivityController } from "../../presentation/interfaces/controllers/activity/activity-controller.interface";
import { IAddressController } from "../../presentation/interfaces/controllers/address/address-controller.interface";
import { IAdminController } from "../../presentation/interfaces/controllers/admin/admin.controller.interface";
import { IAuthController } from "../../presentation/interfaces/controllers/auth/auth.controller.interfaces";
import { IClientBookingController } from "../../presentation/interfaces/controllers/booking/client-booking-controller.interface";
import { IGuideBookingController } from "../../presentation/interfaces/controllers/booking/guide-booking-controller.interface";
import { IVendorBookingController } from "../../presentation/interfaces/controllers/booking/vendor-booking-controller.interface";
import { IClientProfileController } from "../../presentation/interfaces/controllers/client/clientProfile-controller.interface";
import { IGuideClientController } from "../../presentation/interfaces/controllers/client/guideClient-controller.interface";
import { ICommonController } from "../../presentation/interfaces/controllers/common.controller.interface";
import { IFcmController } from "../../presentation/interfaces/controllers/fcmToken.controller";
import { IGuideProfileController } from "../../presentation/interfaces/controllers/guide/guide-profile-controller.interface";
import { IGuideController } from "../../presentation/interfaces/controllers/guide/guide.controller.interface";
import { IItineraryController } from "../../presentation/interfaces/controllers/itinerary/itinerary-controller.interface";
import { IKycController } from "../../presentation/interfaces/controllers/kyc/kycController.interface";
import { INotificationController } from "../../presentation/interfaces/controllers/notification/notification-controller.interface";
import { IClientPackageController } from "../../presentation/interfaces/controllers/package/client-package.controller";
import { IGuidePackageController } from "../../presentation/interfaces/controllers/package/guide-package-controller.interface";
import { IPackageController } from "../../presentation/interfaces/controllers/package/package.controller.interface";
import { IPaymentController } from "../../presentation/interfaces/controllers/payment/payment-controller.interface";
import { IReviewController } from "../../presentation/interfaces/controllers/review/review-controller.interface";
import { ISignedUrlController } from "../../presentation/interfaces/controllers/signedUrl.controller.interface";
import { IVendorProfileController } from "../../presentation/interfaces/controllers/vendor/vendor-profile.controller.interface";
import { IVendorController } from "../../presentation/interfaces/controllers/vendor/vendor.controller.interface";
import { IVendorSalesReportController } from "../../presentation/interfaces/controllers/vendor/vendor-sales-report-controller.interface";
import { IWishlistController } from "../../presentation/interfaces/controllers/wishlist/wishlist-controller.interface";
import { IBlockedMiddleware } from "../../presentation/interfaces/middleware/blocked-middleware.interface";
import { IErrorMiddleware } from "../../presentation/interfaces/middleware/error-middleware.interface";
import { IChatSocketHandler } from "../../presentation/interfaces/socket/chat-socket-handler.interface";
import { IGroupChatSocketHandler } from "../../presentation/interfaces/socket/group-chat-socket-handler.interface";
import { BlockedMiddleware } from "../../presentation/middlewares/block.middleware";
import { ErrorMiddleware } from "../../presentation/middlewares/error.middleware";
import { LoggerMiddleware } from "../../presentation/middlewares/logger.middleware";
import { AdminRoute } from "../../presentation/route/admin/admin.route";
import { AuthRoutes } from "../../presentation/route/auth/auth";
import { ClientRoute } from "../../presentation/route/client/client.route";
import { GuideRoute } from "../../presentation/route/guide/guide.route";
import { VendorRoute } from "../../presentation/route/vendor/vendor.route";
import { ChatSocketHandler } from "../../presentation/socket/chatSocketHandler";
import { GroupChatSocketHandler } from "../../presentation/socket/groupChatSocketHandler";
import { CronScheduler } from "../cron/cronScheduler";
import { ICronScheduler } from "../interface/cronScheduler.interface";

import { DependencyInjection } from ".";
import { INotificationSocketHandler } from "../../presentation/interfaces/socket/notification-socket-handler.interface";
import { NotificationSocketHandler } from "../../presentation/socket/notificationSocketHandler";
import { RealTimeNotificationService } from "../service/real-time-notification.service";
import { IRealTimeNotificationService } from "../../domain/service-interfaces/real-time-notification-service.interface";

DependencyInjection.registerAll();

//Middlewares
export const errorMiddleware =
  container.resolve<IErrorMiddleware>(ErrorMiddleware);

//Block middleware
export const blockMiddleware =
  container.resolve<IBlockedMiddleware>(BlockedMiddleware);

//logger servie middleware
export const injectedLoggerMiddleware =
  container.resolve<LoggerMiddleware>("LoggerMiddleware");
export const injectedLogger = container.resolve<ILogger>("ILogger");

//authController
export const authController =
  container.resolve<IAuthController>(AuthController);

//vendor Controller
export const vendorController =
  container.resolve<IVendorController>(VendorController);

export const vendorProfileController =
  container.resolve<IVendorProfileController>(VendorProfileController);

export const vendorSalesReportController =
  container.resolve<IVendorSalesReportController>(VendorSalesReportController);

//admin controller
export const adminController =
  container.resolve<IAdminController>(AdminController);

//guide controller
export const guideController =
  container.resolve<IGuideController>(GuideController);

//guide profile controller
export const guideProfileController =
  container.resolve<IGuideProfileController>(GuideProfileController);

//client related controller
export const clientProfileController =
  container.resolve<IClientProfileController>(ClientProfileController);

//address controller
export const addressController =
  container.resolve<IAddressController>(AddressController);

//kyc controller
export const kycController = container.resolve<IKycController>(KycController);

//package controller
export const packageConroller =
  container.resolve<IPackageController>(PackageController);

//itinerary controller
export const itineraryController =
  container.resolve<IItineraryController>(ItineraryController);

//activity controller
export const activityController =
  container.resolve<IActivityController>(ActivityController);

//clien-package controller
export const clientPackageController =
  container.resolve<IClientPackageController>(ClientPackageController);

//guide-package controller
export const guidePackageController =
  container.resolve<IGuidePackageController>(GuidePackageController);

//client-booking controler
export const clientBookingController =
  container.resolve<IClientBookingController>(ClientBookingController);

//vendor-booking controller
export const vendorBookingController =
  container.resolve<IVendorBookingController>(VendorBookingController);

//guide-booking controller
export const guideBookingController =
  container.resolve<IGuideBookingController>(GuideBookingController);

//guide-client controller
export const guideClientController = container.resolve<IGuideClientController>(
  GuideClientController
);

//payment controller
export const paymentController =
  container.resolve<IPaymentController>(PaymentController);

//common upload controller
export const commonController =
  container.resolve<ICommonController>(CommonController);

//fcm token controller
export const fcmTokenController =
  container.resolve<IFcmController>(FcmTokencontroller);

//notification controller
export const notificationController =
  container.resolve<INotificationController>(NotificationController);

//wishlist controller
export const wishlistController =
  container.resolve<IWishlistController>(WishlistController);

//review controller
export const reviewController =
  container.resolve<IReviewController>(ReviewController);

//chat controller
export const chatController = container.resolve(ChatController);

//wallet controller
export const walletController = container.resolve(WalletController);

//guide instruction controller
export const guideInstructionController = container.resolve(
  GuideInstructionController
);

//group chat controller
export const groupChatController = container.resolve(GroupChatController);

//signed url controller
export const signedUrlController =
  container.resolve<ISignedUrlController>(SignedUrlController);

//cron scheduler
export const cronScheduler = container.resolve<ICronScheduler>(CronScheduler);

//auth route
export const authRoutes = container.resolve(AuthRoutes);

//client route
export const clientRoutes = container.resolve(ClientRoute);

//admin route
export const adminRoutes = container.resolve(AdminRoute);

//vendor route
export const vendorRoutes = container.resolve(VendorRoute);

//guide route
export const guideRoutes = container.resolve(GuideRoute);

//chat socket handler
container.register<IChatSocketHandler>("IChatSocketHandler", {
  useClass: ChatSocketHandler,
});

// chat socket handler
export const chatSocketHandler =
  container.resolve<IChatSocketHandler>("IChatSocketHandler");

// group chat socket handler registration
container.register<IGroupChatSocketHandler>("IGroupChatSocketHandler", {
  useClass: GroupChatSocketHandler,
});

// group chat socket handler
export const groupChatSocketHandler =
  container.resolve<IGroupChatSocketHandler>("IGroupChatSocketHandler");

//notification socket handler registration
container.register<INotificationSocketHandler>("INotificationSocketHandler",{
  useClass : NotificationSocketHandler
});  

//notification socket handler
export const notificationSocketHandler =
  container.resolve<INotificationSocketHandler>("INotificationSocketHandler");

//real-time notification service
export const realTimeNotificationService =
  container.resolve<IRealTimeNotificationService>("IRealTimeNotificationService");
