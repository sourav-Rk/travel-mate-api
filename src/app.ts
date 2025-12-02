import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { container } from "./config/container";

export class App {
  private app: Application;

  constructor() {
    dotenv.config();
    this.app = express();
    this.setMiddleware();
  }

  private setMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use("/api/auth", container.authRouter.routes);
    this.app.use("/api/post", container.postRouter.routes);
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }
  public getApp() {
    return this.app;
  }
}
