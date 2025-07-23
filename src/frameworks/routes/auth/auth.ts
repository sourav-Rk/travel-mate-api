import { Router } from "express";
import { authController } from "../../di/resolve";
import { asyncHandler } from "../../../shared/async-handler";

export class AuthRoutes {
  private _router: Router;

  constructor() {
    this._router = Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this._router.post(
      "/signup",
      asyncHandler(authController.signup.bind(authController))
    ),
      this._router.post(
        "/login",
        asyncHandler(authController.login.bind(authController))
      );
    this._router.post(
      "/google-auth",
      asyncHandler(authController.googleSignup.bind(authController))
    );
    this._router.post(
      "/send-otp",
      asyncHandler(authController.sendEmail.bind(authController))
    ),
      this._router.post(
        "/resend-otp",
        asyncHandler(authController.resendOtp.bind(authController))
      );
    this._router.post(
      "/verify-otp",
      asyncHandler(authController.verifyOtp.bind(authController))
    );
    this._router.post(
      "/forgot-password/mail",
      asyncHandler(authController.forgotPasswordSendMail.bind(authController))
    );
    this._router.post(
      "/forgot-password/reset",
      asyncHandler(authController.forgotPasswordReset.bind(authController))
    );
  }

  public getRouter(): Router {
    return this._router;
  }
}
