import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/token.service";
import { JwtPayload } from "jsonwebtoken";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import redisClient from "../../frameworks/redis/redisClient";
import { CustomError } from "../../shared/utils/error/customError";

const tokenService = new TokenService();

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  access_token: string;
  refresh_token: string;
}

export interface CustomRequest extends Request {
  user: CustomJwtPayload;
}

const extractToken = (
  req: Request
): { access_token: string; refresh_token: string } | null => {
  const pathSegments = req.path.split("/");
  const privateRouteIndex = pathSegments.indexOf("");
  if (privateRouteIndex !== -1 && pathSegments[privateRouteIndex + 1]) {
    const userType = pathSegments[privateRouteIndex + 1];
    return {
      access_token: req.cookies[`${userType}_access_token`] || null,
      refresh_token: req.cookies[`${userType}_refresh_token`] || null,
    };
  }
  return null;
};

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
    const token = extractToken(req);
    if (!token) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS });
      return;
    }

    if (await isBlackListed(token.access_token)) {
      res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: "Token is black listed" });
      return;
    }

    const user = tokenService.verifyAccessToken(
      token.access_token
    ) as CustomJwtPayload;

    if (!user || !user.id) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS });
      return;
    }

    (req as CustomRequest).user = {
      ...user,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    };
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
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

export const decodeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      console.log("no token");
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS });
      return;
    }

    if (await isBlackListed(token.access_token)) {
      console.log("token is black listed worked");
      res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: "Token is blacklisted" });
      return;
    }

    const user = tokenService.decodeAcessToken(token?.access_token);
    console.log("decode:", user);
    (req as CustomRequest).user = {
      id: user?.id,
      email: user?.email,
      role: user?.role,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    };
    next();
  } catch (error) {}
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
  const {token} = req.body;

  if (!token) throw new CustomError(HTTP_STATUS.BAD_REQUEST,"token is missing")

  if (await isBlackListed(token)) {
    console.log("token is black listed worked");
    res.status(HTTP_STATUS.FORBIDDEN).json({success : false,message : "token is blacklisted"})
  }

  try {
    const user = tokenService.decodeResetToken(token);
    req.body.id = user?.id;
    next();
  } catch (error) {
    
  }
};
