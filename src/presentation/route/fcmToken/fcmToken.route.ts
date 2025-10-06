import { NextFunction, Request, Response, Router } from "express";
import { authorizeRole, verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { fcmTokenController } from "../../../infrastructure/dependencyInjection/resolve";

export class FcmTokenRoutes {
  public router = Router();

  constructor(private role: "vendor" | "client") {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post(
      `/${this.role}/fcm/save`,
      verifyAuth,
      authorizeRole(["client", "vendor"]),
      asyncHandler(fcmTokenController.saveFcmToken.bind(fcmTokenController))
    );
  }
}
