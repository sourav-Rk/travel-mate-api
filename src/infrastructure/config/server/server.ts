import "reflect-metadata";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import qs from "qs";

import { config } from "../../../shared/config";
import {
  adminRoutes,
  authRoutes,
  clientRoutes,
  errorMiddleware,
  guideRoutes,
  injectedLoggerMiddleware,
  vendorRoutes,
} from "../../dependencyInjection/resolve";

export class App {
  private _app: Application;

  constructor() {
    this._app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorMiddleware();
  }

  private configureRoutes(): void {
    this._app.use("/api/v1/auth", authRoutes.router);
    this._app.use("/api/v1/client", clientRoutes.router);
    this._app.use("/api/v1/vendor", vendorRoutes.router);
    this._app.use("/api/v1/admin", adminRoutes.router);
    this._app.use("/api/v1/guide", guideRoutes.router);
  }

  private configureMiddleware(): void {
    this._app.set("query parser", (str: string) =>
      qs.parse(str, { allowDots: true, allowPrototypes: false })
    );
    this._app.use(
      cors({
        origin: config.client.uri,
        credentials: true,
      })
    );
    this._app.use((req, res, next) => {
      if (req.originalUrl === "/api/v1/client/payment/webhook") {
        next();
      } else {
        express.json()(req, res, next);
      }
    });

    this._app.use(express.urlencoded({ extended: true }));

    this._app.use(
      injectedLoggerMiddleware.handle.bind(injectedLoggerMiddleware)
    );
    this._app.use(cookieParser());
  }

  private configureErrorMiddleware(): void {
    this._app.use(errorMiddleware.handleError.bind(errorMiddleware));
  }

  public getApp(): Application {
    return this._app;
  }
}
