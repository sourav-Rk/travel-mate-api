import { injectable } from "tsyringe";

import { logger } from "../config/logger/winston.logger.config";

import { ILogger } from "../../domain/service-interfaces/logger.interface";

@injectable()
export class WinstonLoggerAdapter implements ILogger {
  info(message: string, meta?: Record<string, any>): void {
    logger.info(message, meta);
  }

  error(message: string, meta?: Record<string, any>): void {
    logger.error(message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    logger.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    logger.debug(message, meta);
  }
}
