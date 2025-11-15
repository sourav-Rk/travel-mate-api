import { Router } from "express";

import { fcmTokenController } from "../../../infrastructure/dependencyInjection/resolve";
import { asyncHandler } from "../../../shared/async-handler";
import { authorizeRole, verifyAuth } from "../../middlewares/auth.middleware";

export class FcmTokenRoutes {
  public router = Router();

  constructor(private role: "vendor" | "client") {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post(
      `/fcm/save`,
      verifyAuth,
      authorizeRole(["client", "vendor"]),
      asyncHandler(fcmTokenController.saveFcmToken.bind(fcmTokenController))
    );
  }
}
