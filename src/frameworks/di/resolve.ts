import { AuthController } from "../../interfaceAdapters/controllers/auth/auth.controller";
import { container } from "tsyringe";
import { DependencyInjection } from ".";
import { IAuthController } from "../../entities/controllerInterfaces/auth.controller.interfaces";
import { ErrorMiddleware } from "../../interfaceAdapters/middlewares/error.middleware";
import { IErrorMiddleware } from "../../entities/middleWareInterfaces/error-middleware.interface";
import { LoggerMiddleware } from "../../interfaceAdapters/middlewares/logger.middleware";
import { ILogger } from "../../interfaceAdapters/services/logger/logger.interface";
import { IVendorController } from "../../entities/controllerInterfaces/vendor.controller.interface";
import { VendorController } from "../../interfaceAdapters/controllers/vendor/vendor.controller";
import { ICommonController } from "../../entities/controllerInterfaces/common.controller.interface";
import { CommonController } from "../../interfaceAdapters/controllers/common/common.controller";
import { IAdminController } from "../../entities/controllerInterfaces/admin.controller.interface";
import { AdminController } from "../../interfaceAdapters/controllers/admin/admin.controller";
import { IGuideController } from "../../entities/controllerInterfaces/guide.controller.interface";
import { GuideController } from "../../interfaceAdapters/controllers/guide/guide.controller";

DependencyInjection.registerAll();

//authController
export const authController = container.resolve<IAuthController>(AuthController);

//vendor Controller
export const vendorController = container.resolve<IVendorController>(VendorController);

//admin controller
export const adminController = container.resolve<IAdminController>(AdminController);

//guide controller
export const guideController = container.resolve<IGuideController>(GuideController);

//common upload controller
export const commonController = container.resolve<ICommonController>(CommonController);

//Middlewares
export const errorMiddleware = container.resolve<IErrorMiddleware>(ErrorMiddleware);

//logger servie middleware
export const injectedLoggerMiddleware = container.resolve<LoggerMiddleware>("LoggerMiddleware");
export const injectedLogger = container.resolve<ILogger>("ILogger");
