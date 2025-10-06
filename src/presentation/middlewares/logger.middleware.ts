import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ILogger } from "../../domain/service-interfaces/logger.interface";

@injectable()
export class LoggerMiddleware {
  constructor(
    @inject("ILogger")
    private logger: ILogger
  ) {}

  public handle(req: Request, res: Response, next: NextFunction) {
    this.logger.info("in logger ->", {
      req: req.method,
      url: req.url,
      //timestamp : new Date().toISOString(),
    });

    console.log(req.method, req.url);
    next();
  }
}
