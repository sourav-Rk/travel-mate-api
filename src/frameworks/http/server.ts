import "reflect-metadata";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";

import { config } from "../../shared/config";
import { errorMiddleware, injectedLoggerMiddleware } from "../di/resolve";
import { AuthRoutes } from "../routes/auth/auth";
import { PrivateRoute } from "../routes/common/private.route";

export class App {
  private _app: Application;

  constructor() {
    this._app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorMiddleware();
  }

  private configureRoutes(): void {
    this._app.use("/api/auth", new AuthRoutes().getRouter());
    this._app.use("/api/pvt", new PrivateRoute().router);
  }

  private configureMiddleware(): void {
    this._app.use(
      cors({
        origin: config.client.uri,
        credentials: true,
      })
    );
    this._app.use((req,res,next) => {
      if(req.originalUrl === "/api/pvt/_cl/client/payment/webhook"){
        next();
      }else{
        express.json()(req,res,next)
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
