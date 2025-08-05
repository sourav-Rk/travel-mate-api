import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  addressController,
  authController,
  vendorController,
  vendorProfileController,
} from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";
import { SignedUrlRoute } from "../common/signedUrl.route";

export class VendorRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use("/", new CommonUploadRoutes("vendor").router);

    this.router.use("/", new SignedUrlRoute("vendor").router);

    // this.router.post(
    // "/vendor/images/upload",
    //   upload.array("image", 5),
    //   (req: Request, res: Response, next: NextFunction) => {
    //     commonController.uploadImages(req as MulterRequest, res, next);
    //   }
    // );

    this.router
      .route("/vendor/details")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          vendorProfileController.getVendorDetails.bind(vendorProfileController)
        )
      )
      .put(
        verifyAuth,
        authorizeRole(["vendor"]),
        asyncHandler(
          vendorProfileController.updateVendorProfile.bind(
            vendorProfileController
          )
        )
      );
  
    this.router.post("/vendor/change-email",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(authController.sendEmailOtp.bind(authController))
    );

    this.router.post("/vendor/resent-otp",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(authController.resendOtp.bind(authController))
    )

    this.router.post("/vendor/verify-otp",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(authController.verifyOtp.bind(authController))
    )

    this.router.put(
      "/vendor/update-password",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(
        vendorProfileController.updatePassword.bind(vendorProfileController)
      )
    );

    this.router.post(
    "/vendor/address",
    verifyAuth,
    authorizeRole(["vendor"]),
    asyncHandler(addressController.addAddress.bind(addressController))
    );


    this.router.put("/vendor/address",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(addressController.updateAddress.bind(addressController))
    )

    this.router.post(
      "/vendor/guide",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(vendorController.addGuide.bind(vendorController))
    );

    this.router.post(
      "/vendor/kyc",
      verifyAuth,
      authorizeRole(["vendor"]),
      asyncHandler(vendorController.addKyc.bind(vendorController))
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
      asyncHandler(vendorController.getDetailsforStatus.bind(vendorController))
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
