import { Router } from "express";

import {
  authorizeRole,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { signedUrlController } from "../../di/resolve";

export class SignedUrlRoute {
  public router = Router();

  constructor(private role: "vendor" | "client" | "admin" | "guide") {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post(
      `/${this.role}/signed-url`,
      verifyAuth,
      authorizeRole([`${this.role}`]),
      asyncHandler(
        signedUrlController.generateSignedUrl.bind(signedUrlController)
      )
    );
  }
}
