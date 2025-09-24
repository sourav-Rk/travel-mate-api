import { container } from "tsyringe";

import { IActivityController } from "../../entities/controllerInterfaces/activity/activity-controller.interface";
import { IAddressController } from "../../entities/controllerInterfaces/address/address-controller.interface";
import { IAdminController } from "../../entities/controllerInterfaces/admin/admin.controller.interface";
import { IAuthController } from "../../entities/controllerInterfaces/auth/auth.controller.interfaces";
import { IClientProfileController } from "../../entities/controllerInterfaces/client/clientProfile-controller.interface";
import { ICommonController } from "../../entities/controllerInterfaces/common.controller.interface";
import { IGuideProfileController } from "../../entities/controllerInterfaces/guide/guide-profile-controller.interface";
import { IGuideController } from "../../entities/controllerInterfaces/guide/guide.controller.interface";
import { IItineraryController } from "../../entities/controllerInterfaces/itinerary/itinerary-controller.interface";
import { IKycController } from "../../entities/controllerInterfaces/kyc/kycController.interface";
import { IClientPackageController } from "../../entities/controllerInterfaces/package/client-package.controller";
import { IPackageController } from "../../entities/controllerInterfaces/package/package.controller.interface";
import { ISignedUrlController } from "../../entities/controllerInterfaces/signedUrl.controller.interface";
import { IVendorProfileController } from "../../entities/controllerInterfaces/vendor/vendor-profile.controller.interface";
import { IVendorController } from "../../entities/controllerInterfaces/vendor/vendor.controller.interface";
import { IBlockedMiddleware } from "../../entities/middleWareInterfaces/blocked-middleware.interface";
import { IErrorMiddleware } from "../../entities/middleWareInterfaces/error-middleware.interface";
import { ActivityController } from "../../interfaceAdapters/controllers/activity/activity.controller";
import { AddressController } from "../../interfaceAdapters/controllers/address/address.controller";
import { AdminController } from "../../interfaceAdapters/controllers/admin/admin.controller";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller";
import { ClientProfileController } from "../../interfaceAdapters/controllers/client/clientProfile.controller";
import { CommonController } from "../../interfaceAdapters/controllers/common/common.controller";
import { GuideController } from "../../interfaceAdapters/controllers/guide/guide.controller";
import { GuideProfileController } from "../../interfaceAdapters/controllers/guide/guideProfileController";
import { ItineraryController } from "../../interfaceAdapters/controllers/itinerary/itinerary.controller";
import { KycController } from "../../interfaceAdapters/controllers/kyc/kycController";
import { SignedUrlController } from "../../interfaceAdapters/controllers/media/signedUrl.controller";
import { ClientPackageController } from "../../interfaceAdapters/controllers/package/client-package-controller.interface";
import { PackageController } from "../../interfaceAdapters/controllers/package/package.controller";
import { VendorController } from "../../interfaceAdapters/controllers/vendor/vendor.controller";
import { VendorProfileController } from "../../interfaceAdapters/controllers/vendor/vendor.profile.controller";
import { BlockedMiddleware } from "../../interfaceAdapters/middlewares/block.middleware";
import { ErrorMiddleware } from "../../interfaceAdapters/middlewares/error.middleware";
import { LoggerMiddleware } from "../../interfaceAdapters/middlewares/logger.middleware";
import { ILogger } from "../../interfaceAdapters/services/logger/logger.interface";

import { DependencyInjection } from ".";
import { IClientBookingController } from "../../entities/controllerInterfaces/booking/client-booking-controller.interface";
import { ClientBookingController } from "../../interfaceAdapters/controllers/booking/client-booking-controller";
import { IVendorBookingController } from "../../entities/controllerInterfaces/booking/vendor-booking-controller.interface";
import { VendorBookingController } from "../../interfaceAdapters/controllers/booking/vendor-booking-controller";
import { IFcmController } from "../../entities/controllerInterfaces/fcmToken.controller";
import { FcmTokencontroller } from "../../interfaceAdapters/controllers/common/fcmToken.controller";
import { INotificationController } from "../../entities/controllerInterfaces/notification/notification-controller.interface";
import { NotificationController } from "../../interfaceAdapters/controllers/notification/notification.controller";
import { CronScheduler } from "../cron/cronScheduler";
import { ICronScheduler } from "../../entities/cronInterfaces/cronScheduler.interface";
import { IPaymentController } from "../../entities/controllerInterfaces/payment/payment-controller.interface";
import { PaymentController } from "../../interfaceAdapters/controllers/payment/payment.controller";
import { IWishlistController } from "../../entities/controllerInterfaces/wishlist/wishlist-controller.interface";
import { WishlistController } from "../../interfaceAdapters/controllers/wishlist/wishlist.controller";
import { IReviewController } from "../../entities/controllerInterfaces/review/review-controller.interface";
import { ReviewController } from "../../interfaceAdapters/controllers/review/review.controller";
import { ClientRoute } from "../routes/client/client.route";
import { AuthRoutes } from "../routes/auth/auth";
import { AdminRoute } from "../routes/admin/admin.route";
import { VendorRoute } from "../routes/vendor/vendor.route";
import { GuideRoute } from "../routes/guide/guide.route";
import { IGuidePackageController } from "../../entities/controllerInterfaces/package/guide-package-controller.interface";
import { GuidePackageController } from "../../interfaceAdapters/controllers/package/guide-package-controller";
import { IGuideBookingController } from "../../entities/controllerInterfaces/booking/guide-booking-controller.interface";
import { GuideBookingController } from "../../interfaceAdapters/controllers/booking/guide-booking-controller";

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
