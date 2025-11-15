import { injectable } from "tsyringe";

import { ForgotPasswordResetReqDTO, GoogleSignupReqDTO, LoginReqDTO, OtpReqDTO, ResendOtpReqDTO } from "../../../application/dto/request/auth.dto";
import {
  authController,
  blockMiddleware,
} from "../../../infrastructure/dependencyInjection/resolve";
import { asyncHandler } from "../../../shared/async-handler";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { BaseRoute } from "../base.route";

@injectable()
export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/signup",
      asyncHandler(authController.signup.bind(authController))
    );
    this.router.post(
      "/login",
      validationMiddleware(LoginReqDTO),
      asyncHandler(authController.login.bind(authController))
    );
    this.router.post(
      "/google-auth",
      validationMiddleware(GoogleSignupReqDTO),
      asyncHandler(authController.googleSignup.bind(authController))
    );
    this.router.post(
      "/send-otp",
      asyncHandler(authController.sendEmail.bind(authController))
    );
    this.router.post(
      "/resend-otp",
      validationMiddleware(ResendOtpReqDTO),
      asyncHandler(authController.resendOtp.bind(authController))
    );
    this.router.post(
      "/verify-otp",
      validationMiddleware(OtpReqDTO),
      asyncHandler(authController.verifyOtp.bind(authController))
    );
    this.router.post(
      "/forgot-password/mail",
      validationMiddleware(ResendOtpReqDTO),
      asyncHandler(authController.forgotPasswordSendMail.bind(authController))
    );
    this.router.post(
      "/forgot-password/reset",
      validationMiddleware(ForgotPasswordResetReqDTO),
      asyncHandler(authController.forgotPasswordReset.bind(authController))
    );

    this.router.post(
      "/refresh-token",
      asyncHandler(authController.refreshToken.bind(authController))
    );

    this.router.post(
      "/logout",
      verifyAuth,
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.logout.bind(authController))
    );
  }

}
