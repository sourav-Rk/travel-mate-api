import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { authController, vendorController } from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";

export class VendorRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    
      this.router.use("/", new CommonUploadRoutes("vendor").router);

    // this.router.post(
    // "/vendor/images/upload",
    //   upload.array("image", 5),
    //   (req: Request, res: Response, next: NextFunction) => {
    //     commonController.uploadImages(req as MulterRequest, res, next);
    //   }
    // );

    this.router.post(
      "/vendor/guide",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(vendorController.addGuide.bind(vendorController))
    )

    this.router.post(
      "/vendor/kyc",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(vendorController.addKyc.bind(vendorController))
    )
    
    this.router.post(
      "/vendor/address",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(vendorController.addAddress.bind(vendorController))
    );

        this.router.patch(
      "/vendor/status",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(vendorController.updateVendorStatus.bind(vendorController))
    );


    this.router.get(
      "/vendor/profile",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(vendorController.getDetails.bind(vendorController))
    );

    this.router.post(
      "/vendor/logout",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(authController.logout.bind(authController))
    );

    this.router.post(
      "/vendor/refresh-token",
      decodeToken,
      asyncHandler(authController.refreshToken.bind(authController))
    );
  }
}
