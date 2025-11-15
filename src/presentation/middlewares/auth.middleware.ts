import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import { CustomError } from "../../domain/errors/customError";
import redisClient from "../../infrastructure/config/redis/redisClient.config";
import { TokenService } from "../../infrastructure/service/token.service";
import {
  COOKIES_NAMES,
  ERROR_MESSAGE,
  HTTP_STATUS,
} from "../../shared/constants";

const tokenService = new TokenService();

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedUser extends CustomJwtPayload {
  accessToken: string;
  refreshToken: string;
}

export interface CustomRequest extends Request {
  user: AuthenticatedUser;
}

/**
 * Helper: check if a token is blacklisted in Redis
 */
const isBlackListed = async (token: string): Promise<boolean> => {
  const result = await redisClient.get(token);
  return result !== null;
};

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("verify auth middleware worked");
    const refreshToken = req.cookies[COOKIES_NAMES.REFRESH_TOKEN];
    const token = req.cookies[COOKIES_NAMES.ACCESS_TOKEN];
    if (!token) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS });
      return;
    }



    const user = tokenService.verifyAccessToken(token) as CustomJwtPayload;

    if (!user || !user.id) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS });
      return;
    }

    if (await isBlackListed(token)) {
      res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: ERROR_MESSAGE.TOKEN_BLACK_LISTED});
      return;
    }

    if(await isBlackListed(refreshToken)){
      res.status(HTTP_STATUS.FORBIDDEN)
      .json({message : ERROR_MESSAGE.TOKEN_BLACK_LISTED})
    }

    (req as CustomRequest).user = {
      ...user,
      accessToken: token,
      refreshToken: req.cookies[COOKIES_NAMES.REFRESH_TOKEN],
    };
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.TOKEN_EXPIRED_ACCESS });
      return;
    }
    console.log("invalid token WORKDED");

    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGE.INVALID_TOKEN });
  }
};

/**
 * Middleware: decodeToken
 */

export const decodeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies[COOKIES_NAMES.ACCESS_TOKEN];

    if (!token) {
      console.log("no token");
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS });
      return;
    }

    if (await isBlackListed(token)) {
      console.log("token is black listed worked");
      res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: ERROR_MESSAGE.TOKEN_BLACK_LISTED });
      return;
    }

    const user = tokenService.decodeAcessToken(token);
    console.log("decode:", user);
    if (!user || !user.id) {
      throw new CustomError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }
    (req as CustomRequest).user = {
      id: user?.id,
      email: user?.email,
      role: user?.role,
      accessToken: token,
      refreshToken: req.cookies[COOKIES_NAMES.REFRESH_TOKEN],
    };
    next();
  } catch (error) {
    console.log(error);
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as CustomRequest).user;

    if (!user || !allowedRoles.includes(user.role)) {
      console.log("role not allowed");
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGE.FORBIDDEN,
        userRole: user ? user.role : "None",
      });
      return;
    }
    next();
  };
};

//-----middleware to handle reset password
export const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;

  if (!token)
    throw new CustomError(HTTP_STATUS.BAD_REQUEST, "token is missing");

  if (await isBlackListed(token)) {
    console.log("token is black listed worked");
    res
      .status(HTTP_STATUS.FORBIDDEN)
      .json({ success: false, message: "token is blacklisted" });
  }

  try {
    const user = tokenService.verifyResetToken(token);
    console.log(user, "reset");
    req.body.id = user?.id;
    next();
  } catch (error) {
    console.log(error);
  }
};
