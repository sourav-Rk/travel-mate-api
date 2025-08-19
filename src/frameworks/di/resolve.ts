import { container } from "tsyringe";

import { IAddressController } from "../../entities/controllerInterfaces/address/address-controller.interface";
import { IAdminController } from "../../entities/controllerInterfaces/admin/admin.controller.interface";
import { IAuthController } from "../../entities/controllerInterfaces/auth/auth.controller.interfaces";
import { IClientProfileController } from "../../entities/controllerInterfaces/client/clientProfile-controller.interface";
import { ICommonController } from "../../entities/controllerInterfaces/common.controller.interface";
import { IGuideProfileController } from "../../entities/controllerInterfaces/guide/guide-profile-controller.interface";
import { IGuideController } from "../../entities/controllerInterfaces/guide/guide.controller.interface";
import { IKycController } from "../../entities/controllerInterfaces/kyc/kycController.interface";
import { ISignedUrlController } from "../../entities/controllerInterfaces/signedUrl.controller.interface";
import { IVendorProfileController } from "../../entities/controllerInterfaces/vendor/vendor-profile.controller.interface";
import { IVendorController } from "../../entities/controllerInterfaces/vendor/vendor.controller.interface";
import { IBlockedMiddleware } from "../../entities/middleWareInterfaces/blocked-middleware.interface";
import { IErrorMiddleware } from "../../entities/middleWareInterfaces/error-middleware.interface";
import { AddressController } from "../../interfaceAdapters/controllers/address/address.controller";
import { AdminController } from "../../interfaceAdapters/controllers/admin/admin.controller";
import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller";
import { ClientProfileController } from "../../interfaceAdapters/controllers/client/clientProfile.controller";
import { CommonController } from "../../interfaceAdapters/controllers/common/common.controller";
import { GuideController } from "../../interfaceAdapters/controllers/guide/guide.controller";
import { GuideProfileController } from "../../interfaceAdapters/controllers/guide/guideProfileController";
import { KycController } from "../../interfaceAdapters/controllers/kyc/kycController";
import { SignedUrlController } from "../../interfaceAdapters/controllers/media/signedUrl.controller";
import { VendorController } from "../../interfaceAdapters/controllers/vendor/vendor.controller";
import { VendorProfileController } from "../../interfaceAdapters/controllers/vendor/vendor.profile.controller";
import { BlockedMiddleware } from "../../interfaceAdapters/middlewares/block.middleware";
import { ErrorMiddleware } from "../../interfaceAdapters/middlewares/error.middleware";
import { LoggerMiddleware } from "../../interfaceAdapters/middlewares/logger.middleware";
import { ILogger } from "../../interfaceAdapters/services/logger/logger.interface";
import { IPackageController } from "../../entities/controllerInterfaces/package/package.controller.interface";
import { PackageController } from "../../interfaceAdapters/controllers/package/package.controller";

import { DependencyInjection } from ".";
import { IItineraryController } from "../../entities/controllerInterfaces/itinerary/itinerary-controller.interface";
import { ItineraryController } from "../../interfaceAdapters/controllers/itinerary/itinerary.controller";
import { IActivityController } from "../../entities/controllerInterfaces/activity/activity-controller.interface";
import { ActivityController } from "../../interfaceAdapters/controllers/activity/activity.controller";


DependencyInjection.registerAll();

//authController
export const authController =
  container.resolve<IAuthController>(AuthController);

//vendor Controller
export const vendorController =
  container.resolve<IVendorController>(VendorController);

export const vendorProfileController = container.resolve<IVendorProfileController>(VendorProfileController);  

//admin controller
export const adminController =
  container.resolve<IAdminController>(AdminController);

//guide controller
export const guideController =
  container.resolve<IGuideController>(GuideController);

//guide profile controller
export const guideProfileController = container.resolve<IGuideProfileController>(GuideProfileController)

//client related controller
export const clientProfileController =
  container.resolve<IClientProfileController>(ClientProfileController);

//address controller
export const addressController = container.resolve<IAddressController>(AddressController)

//kyc controller
export const kycController = container.resolve<IKycController>(KycController)

//package controller
export const packageConroller = container.resolve<IPackageController>(PackageController);

//itinerary controller
export const itineraryController = container.resolve<IItineraryController>(ItineraryController);

//activity controller
export const activityController = container.resolve<IActivityController>(ActivityController);

//common upload controller
export const commonController =
  container.resolve<ICommonController>(CommonController);

//signed url controller
export const signedUrlController =
  container.resolve<ISignedUrlController>(SignedUrlController);

//Middlewares
export const errorMiddleware =
  container.resolve<IErrorMiddleware>(ErrorMiddleware);

//Block middleware
export const blockMiddleware = container.resolve<IBlockedMiddleware>(BlockedMiddleware)  

//logger servie middleware
export const injectedLoggerMiddleware =
  container.resolve<LoggerMiddleware>("LoggerMiddleware");
export const injectedLogger = container.resolve<ILogger>("ILogger");
