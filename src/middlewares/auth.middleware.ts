import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, extractTokenFromHeader } from "../utils/jwt.utils";
import { sendError } from "../utils/response.utils";
import { JwtPayload } from "../types/common.types";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constants";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      sendError(
        res,
        ERROR_MESSAGES.AUTHENTICATION.NO_TOKEN_PROVIDED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      sendError(
        res,
        ERROR_MESSAGES.AUTHENTICATION.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      sendError(
        res,
        ERROR_MESSAGES.AUTHENTICATION.ACCESS_TOKEN_EXPIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }
    sendError(
      res,
      ERROR_MESSAGES.AUTHENTICATION.INVALID_TOKEN,
      HTTP_STATUS.UNAUTHORIZED
    );
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }
    next();
  } catch {
    next();
  }
};
