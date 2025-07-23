import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller";
import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { IAuthController } from "../../entities/controllerInterfaces/auth/auth.controller.interfaces";
import { ErrorMiddleware } from "../../interfaceAdapters/middlewares/error.middleware";
import { IErrorMiddleware } from "../../entities/middleWareInterfaces/error-middleware.interface";
import { LoggerMiddleware } from "../../interfaceAdapters/middlewares/logger.middleware";
import { ILogger } from "../../interfaceAdapters/services/logger/logger.interface";
import { IVendorController } from "../../entities/controllerInterfaces/vendor/vendor.controller.interface";
import { VendorController } from "../../interfaceAdapters/controllers/vendor/vendor.controller";
import { ICommonController } from "../../entities/controllerInterfaces/common.controller.interface";
import { CommonController } from "../../interfaceAdapters/controllers/common/common.controller";
import { IAdminController } from "../../entities/controllerInterfaces/admin/admin.controller.interface";
import { AdminController } from "../../interfaceAdapters/controllers/admin/admin.controller";
import { IGuideController } from "../../entities/controllerInterfaces/guide/guide.controller.interface";
import { GuideController } from "../../interfaceAdapters/controllers/guide/guide.controller";
import { ISignedUrlController } from "../../entities/controllerInterfaces/signedUrl.controller.interface";
import { SignedUrlController } from "../../interfaceAdapters/controllers/media/signedUrl.controller";
import { IClientProfileController } from "../../entities/controllerInterfaces/client/clientProfile-controller.interface";
import { ClientProfileController } from "../../interfaceAdapters/controllers/client/clientProfile.controller";
import { IVendorProfileController } from "../../entities/controllerInterfaces/vendor/vendor-profile.controller.interface";
import { VendorProfileController } from "../../interfaceAdapters/controllers/vendor/vendor.profile.controller";
import { BlockedMiddleware } from "../../interfaceAdapters/middlewares/block.middleware";
import { IBlockedMiddleware } from "../../entities/middleWareInterfaces/blocked-middleware.interface";

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

//client related controller
export const clientProfileController =
  container.resolve<IClientProfileController>(ClientProfileController);

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
