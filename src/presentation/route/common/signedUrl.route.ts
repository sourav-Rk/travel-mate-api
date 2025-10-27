import { Router } from "express";

import { signedUrlController } from "../../../infrastructure/dependencyInjection/resolve";
import { asyncHandler } from "../../../shared/async-handler";
import { authorizeRole, verifyAuth } from "../../middlewares/auth.middleware";

export class SignedUrlRoute {
  public router = Router();

  constructor(private role: "vendor" | "client" | "admin" | "guide") {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post(
      "/signed-url",
      verifyAuth,
      authorizeRole([`${this.role}`]),
      asyncHandler(
        signedUrlController.generateSignedUrl.bind(signedUrlController)
      )
    );
  }
}
